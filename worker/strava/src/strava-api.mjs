import {decryptToken,encryptToken} from "./security.mjs";
import {requireReauth,updateConnectionTokens} from "./repository.mjs";
const TOKEN_URL="https://www.strava.com/oauth/token";
const API_BASE="https://www.strava.com/api/v3";
async function parsed(response){
  let data={};
  try{data=await response.json();}catch{}
  if(!response.ok){
    const retryAfter=Number(response.headers.get("Retry-After"))||null;
    throw Object.assign(new Error(response.status===429?"Strava rate limit reached. Try again later.":"Strava rejected the request."),{code:response.status===429?"STRAVA_RATE_LIMITED":"STRAVA_REJECTED",status:response.status,providerStatus:data?.status||null,retryAfter,rateLimit:response.headers.get("X-RateLimit-Limit")||null,rateUsage:response.headers.get("X-RateLimit-Usage")||null});
  }
  return data;
}
function tokenBody(values){const body=new URLSearchParams();Object.entries(values).forEach(([key,value])=>body.set(key,String(value)));return body;}
export async function exchangeAuthorizationCode({env,code,fetchImpl=fetch}){
  const response=await fetchImpl(TOKEN_URL,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:tokenBody({client_id:env.STRAVA_CLIENT_ID,client_secret:env.STRAVA_CLIENT_SECRET,code,grant_type:"authorization_code"})});
  return parsed(response);
}
export async function refreshAccessToken({env,refreshToken,fetchImpl=fetch}){
  const response=await fetchImpl(TOKEN_URL,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:tokenBody({client_id:env.STRAVA_CLIENT_ID,client_secret:env.STRAVA_CLIENT_SECRET,grant_type:"refresh_token",refresh_token:refreshToken})});
  return parsed(response);
}
export async function getValidStravaAccessToken({env,connection,now,fetchImpl=fetch}){
  if(!connection||connection.disconnected_at||connection.requires_reauth||!connection.refresh_token_cipher)throw Object.assign(new Error("Reconnect Strava to continue."),{code:"REAUTH_REQUIRED",status:409});
  if(connection.access_token_cipher&&Number(connection.access_token_expires_at)>now+3600)return decryptToken(connection.access_token_cipher,env.TOKEN_ENCRYPTION_KEY);
  try{
    const refreshToken=await decryptToken(connection.refresh_token_cipher,env.TOKEN_ENCRYPTION_KEY);
    const result=await refreshAccessToken({env,refreshToken,fetchImpl});
    const accessTokenCipher=await encryptToken(result.access_token,env.TOKEN_ENCRYPTION_KEY);
    const refreshTokenCipher=await encryptToken(result.refresh_token,env.TOKEN_ENCRYPTION_KEY);
    await updateConnectionTokens(env.DB,{installationId:connection.installation_id,accessTokenCipher,refreshTokenCipher,expiresAt:result.expires_at});
    return result.access_token;
  }catch(error){
    await requireReauth(env.DB,connection.installation_id);
    throw Object.assign(new Error("Strava authorization expired. Reconnect Strava."),{code:"REAUTH_REQUIRED",status:409,cause:error});
  }
}
export async function submitStrengthUpload({accessToken,payload,fetchImpl=fetch}){
  const form=new FormData();
  form.set("name",payload.name);
  form.set("sport_type","WeightTraining");
  form.set("data_type","json");
  form.set("external_id",payload.externalId);
  form.set("file",new Blob([JSON.stringify(payload.file)],{type:"application/json"}),`${payload.externalId}.json`);
  return parsed(await fetchImpl(`${API_BASE}/uploads`,{method:"POST",headers:{Authorization:`Bearer ${accessToken}`},body:form}));
}
export async function pollUpload({accessToken,uploadId,fetchImpl=fetch}){
  return parsed(await fetchImpl(`${API_BASE}/uploads/${encodeURIComponent(uploadId)}`,{headers:{Authorization:`Bearer ${accessToken}`}}));
}
export async function revokeToken({env,token,fetchImpl=fetch}){
  const credentials=btoa(`${env.STRAVA_CLIENT_ID}:${env.STRAVA_CLIENT_SECRET}`);
  const response=await fetchImpl("https://www.strava.com/oauth/revoke",{method:"POST",headers:{Authorization:`Basic ${credentials}`,"Content-Type":"application/x-www-form-urlencoded"},body:tokenBody({token,token_type_hint:"refresh_token"})});
  if(response.status===401)return {revoked:false,alreadyUnavailable:true};
  if(!response.ok){
    const retryAfter=Number(response.headers.get("Retry-After"))||null;
    throw Object.assign(new Error(response.status===429?"Strava rate limit reached. Try disconnecting again later.":"Strava disconnect could not be confirmed."),{code:response.status===429?"STRAVA_RATE_LIMITED":"REVOCATION_FAILED",status:response.status,retryAfter});
  }
  return {revoked:true,alreadyUnavailable:false};
}
