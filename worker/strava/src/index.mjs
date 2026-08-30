import {decryptToken,encryptToken,randomOpaque,sha256,verifyInstallationSignature} from "./security.mjs";
import {validateUploadPayload} from "./contract.mjs";
import {connectionByInstallation,consumeNonce,consumeOauthState,createOauthState,deleteStravaData,installationById,markUploadStarted,markUploadState,nowSeconds,registerInstallation,saveConnection,uploadByExternalId} from "./repository.mjs";
import {exchangeAuthorizationCode,getValidStravaAccessToken,pollUpload,revokeToken,submitStrengthUpload} from "./strava-api.mjs";

const json=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store",...headers}});
const publicError=error=>({code:error?.code||"REQUEST_FAILED",message:error?.status&&error.status<500?error.message:"The Strava request could not be completed.",...(error?.retryAfter?{retryAfter:error.retryAfter}:{})});
function pwaReturnUrl(env,status){
  const target=new URL(env.PWA_RETURN_URL);
  target.searchParams.set("strava",status);
  return target.toString();
}
function cors(request,env){
  const origin=request.headers.get("Origin");
  if(!origin||origin!==env.PWA_ORIGIN)return {};
  return {"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"Content-Type, X-Road12-Installation-Id, X-Road12-Timestamp, X-Road12-Nonce, X-Road12-Signature","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Vary":"Origin"};
}
async function authenticate(request,env,body="",registrationJwk=null){
  const installationId=request.headers.get("X-Road12-Installation-Id"),timestamp=request.headers.get("X-Road12-Timestamp"),nonce=request.headers.get("X-Road12-Nonce"),signature=request.headers.get("X-Road12-Signature");
  if(!installationId||!timestamp||!nonce||!signature)throw Object.assign(new Error("Installation authentication is required."),{code:"INVALID_AUTH",status:401});
  const now=nowSeconds(),time=Number(timestamp);
  if(!Number.isInteger(time)||Math.abs(now-time)>300)throw Object.assign(new Error("Installation proof expired."),{code:"INVALID_AUTH",status:401});
  const installation=registrationJwk?{id:installationId,public_key_jwk:JSON.stringify(registrationJwk)}:await installationById(env.DB,installationId);
  if(!installation||installation.revoked_at)throw Object.assign(new Error("Installation is not registered."),{code:"INVALID_AUTH",status:401});
  const url=new URL(request.url),valid=await verifyInstallationSignature({jwk:JSON.parse(installation.public_key_jwk),method:request.method,path:url.pathname+url.search,timestamp,nonce,body,signature});
  if(!valid)throw Object.assign(new Error("Installation proof is invalid."),{code:"INVALID_AUTH",status:401});
  if(!registrationJwk&&!(await consumeNonce(env.DB,{installationId,nonce,expiresAt:now+600,now})))throw Object.assign(new Error("Installation proof was already used."),{code:"REPLAYED_AUTH",status:401});
  return installation;
}
const uploadResponse=record=>({externalId:record.external_id,state:record.state,uploadId:record.upload_id||null,activityId:record.activity_id||null,uploadedAt:record.uploaded_at?new Date(record.uploaded_at*1000).toISOString():null,lastAttemptAt:record.last_attempt_at?new Date(record.last_attempt_at*1000).toISOString():null,lastError:record.last_error||null});
async function handle(request,env){
  const url=new URL(request.url),path=url.pathname;
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(request,env)});
  if(path==="/api/strava/callback"&&request.method==="GET"){
    const state=url.searchParams.get("state"),code=url.searchParams.get("code"),denied=url.searchParams.get("error");
    if(!state||denied||!code)return Response.redirect(pwaReturnUrl(env,"denied"),302);
    try{
      const stateRecord=await consumeOauthState(env.DB,{stateHash:await sha256(state),now:nowSeconds()});
      if(!stateRecord)throw Object.assign(new Error("Strava connection request expired or was already used."),{code:"INVALID_OAUTH_STATE",status:400});
      const token=await exchangeAuthorizationCode({env,code});
      const granted=String(token.scope||"").split(/[ ,]+/).filter(Boolean);
      if(!granted.includes("activity:write"))throw Object.assign(new Error("Strava activity write permission was not granted."),{code:"MISSING_SCOPE",status:403});
      await saveConnection(env.DB,{installationId:stateRecord.installation_id,athleteId:String(token.athlete?.id||""),athleteName:[token.athlete?.firstname,token.athlete?.lastname].filter(Boolean).join(" ").trim()||null,accessTokenCipher:await encryptToken(token.access_token,env.TOKEN_ENCRYPTION_KEY),refreshTokenCipher:await encryptToken(token.refresh_token,env.TOKEN_ENCRYPTION_KEY),expiresAt:token.expires_at,scopes:granted.join(" "),connectedAt:nowSeconds()});
      return Response.redirect(pwaReturnUrl(env,"connected"),302);
    }catch{
      return Response.redirect(pwaReturnUrl(env,"error"),302);
    }
  }
  const rawBody=request.method==="POST"?await request.text():"";
  let body={};
  if(rawBody){try{body=JSON.parse(rawBody);}catch{throw Object.assign(new Error("Request body is invalid."),{code:"INVALID_JSON",status:400});}}
  if(path==="/api/install/register"&&request.method==="POST"){
    if(body.installationId!==request.headers.get("X-Road12-Installation-Id"))throw Object.assign(new Error("Installation identity does not match."),{code:"INVALID_AUTH",status:401});
    await authenticate(request,env,rawBody,body.publicKeyJwk);
    const record=await registerInstallation(env.DB,{id:body.installationId,publicKeyJwk:body.publicKeyJwk,now:nowSeconds()});
    const registrationNonce=request.headers.get("X-Road12-Nonce"),registrationNow=nowSeconds();
    if(!(await consumeNonce(env.DB,{installationId:record.id,nonce:registrationNonce,expiresAt:registrationNow+600,now:registrationNow})))throw Object.assign(new Error("Installation proof was already used."),{code:"REPLAYED_AUTH",status:401});
    return json({registered:true,installationId:record.id});
  }
  const installation=await authenticate(request,env,rawBody);
  if(path==="/api/strava/status"&&request.method==="GET"){
    const connection=await connectionByInstallation(env.DB,installation.id);
    return json({connected:!!connection&&!connection.disconnected_at&&!connection.requires_reauth,requiresReauth:!!connection?.requires_reauth,athleteName:connection?.athlete_name||null,connectedAt:connection?.connected_at?new Date(connection.connected_at*1000).toISOString():null});
  }
  if(path==="/api/strava/connect"&&request.method==="POST"){
    const state=randomOpaque(),redirectUri=env.OAUTH_REDIRECT_URI;
    await createOauthState(env.DB,{stateHash:await sha256(state),installationId:installation.id,expiresAt:nowSeconds()+600});
    const authorize=new URL("https://www.strava.com/oauth/authorize");
    authorize.search=new URLSearchParams({client_id:env.STRAVA_CLIENT_ID,redirect_uri:redirectUri,response_type:"code",approval_prompt:"auto",scope:"activity:write",state}).toString();
    return json({authorizeUrl:authorize.toString()});
  }
  if(path==="/api/strava/disconnect"&&request.method==="POST"){
    const connection=await connectionByInstallation(env.DB,installation.id);
    if(connection?.refresh_token_cipher){
      await revokeToken({env,token:await decryptToken(connection.refresh_token_cipher,env.TOKEN_ENCRYPTION_KEY)});
    }
    const deleted=await deleteStravaData(env.DB,installation.id),deletedAt=new Date().toISOString();
    return json({connected:false,deleted:true,deletionConfirmed:true,deletedAt,deletedRecords:deleted});
  }
  if(path==="/api/strava/upload"&&request.method==="POST"){
    const validation=validateUploadPayload(body);
    if(!validation.valid)throw Object.assign(new Error(validation.errors[0]),{code:"INVALID_UPLOAD",status:400});
    const existing=await uploadByExternalId(env.DB,installation.id,body.externalId);
    if(existing?.activity_id||existing?.upload_id&&existing.state==="SYNCING")return json(uploadResponse(existing),existing.activity_id?200:202);
    const connection=await connectionByInstallation(env.DB,installation.id),accessToken=await getValidStravaAccessToken({env,connection,now:nowSeconds()});
    try{
      const result=await submitStrengthUpload({accessToken,payload:body});
      const uploadId=String(result.id_str||result.id||"");
      if(!uploadId)throw Object.assign(new Error("Strava did not return an upload ID."),{code:"INVALID_STRAVA_RESPONSE",status:502});
      await markUploadStarted(env.DB,{installationId:installation.id,externalId:body.externalId,uploadId,state:"SYNCING",now:nowSeconds()});
      return json({externalId:body.externalId,state:"SYNCING",uploadId,activityId:null},202);
    }catch(error){
      await markUploadStarted(env.DB,{installationId:installation.id,externalId:body.externalId,uploadId:null,state:"FAILED",now:nowSeconds()});
      await markUploadState(env.DB,{installationId:installation.id,externalId:body.externalId,state:"FAILED",lastError:"Strava rejected the upload.",now:nowSeconds()});
      throw error;
    }
  }
  const statusMatch=path.match(/^\/api\/strava\/upload\/([^/]+)\/status$/);
  if(statusMatch&&request.method==="GET"){
    const externalId=decodeURIComponent(statusMatch[1]),record=await uploadByExternalId(env.DB,installation.id,externalId);
    if(!record)return json({externalId,state:"NOT_SYNCED",uploadId:null,activityId:null},404);
    if(record.activity_id||record.state==="FAILED"||!record.upload_id)return json(uploadResponse(record));
    const now=nowSeconds();
    if(record.last_polled_at&&now-record.last_polled_at<1)return json(uploadResponse(record),202);
    const connection=await connectionByInstallation(env.DB,installation.id),accessToken=await getValidStravaAccessToken({env,connection,now});
    const result=await pollUpload({accessToken,uploadId:record.upload_id});
    if(result.activity_id){
      await markUploadState(env.DB,{installationId:installation.id,externalId,state:"SYNCED",activityId:String(result.activity_id),lastError:null,now,lastPolledAt:now});
    }else if(result.error){
      await markUploadState(env.DB,{installationId:installation.id,externalId,state:"FAILED",lastError:"Strava could not process this activity.",now,lastPolledAt:now});
    }else await markUploadState(env.DB,{installationId:installation.id,externalId,state:"SYNCING",lastError:null,now,lastPolledAt:now});
    return json(uploadResponse(await uploadByExternalId(env.DB,installation.id,externalId)),result.activity_id?200:result.error?422:202);
  }
  return json({code:"NOT_FOUND",message:"Route not found."},404);
}
export function createWorker(){
  return {async fetch(request,env){
    const headers=cors(request,env);
    try{
      if(request.headers.get("Origin")&&request.headers.get("Origin")!==env.PWA_ORIGIN)return json({code:"ORIGIN_NOT_ALLOWED",message:"Origin is not allowed."},403,headers);
      const response=await handle(request,env);
      Object.entries(headers).forEach(([key,value])=>response.headers.set(key,value));
      return response;
    }catch(error){
      const status=Number(error?.status)||500;
      return json(publicError(error),status,headers);
    }
  }};
}
export default createWorker();
