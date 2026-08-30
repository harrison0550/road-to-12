import assert from "node:assert/strict";
import {createWorker} from "../worker/strava/src/index.mjs";
import {bytesToBase64Url,canonicalRequest,sha256} from "../worker/strava/src/security.mjs";

class FakeD1{
  constructor(){this.installations=new Map();this.nonces=new Map();this.states=new Map();this.connections=new Map();this.uploads=new Map();this.failBatch=false;}
  prepare(sql){
    const db=this,q=sql.replace(/\s+/g," ").trim();
    return {bind(...a){return {query:q,args:a,
      async first(){
        if(q.startsWith("SELECT * FROM installations"))return db.installations.get(a[0])||null;
        if(q.startsWith("SELECT * FROM oauth_states"))return db.states.get(a[0])||null;
        if(q.startsWith("SELECT * FROM strava_connections"))return db.connections.get(a[0])||null;
        if(q.startsWith("SELECT * FROM strava_uploads"))return db.uploads.get(`${a[0]}|${a[1]}`)||null;
        return null;
      },
      async run(){
        if(q.startsWith("INSERT INTO installations")){db.installations.set(a[0],{id:a[0],public_key_jwk:a[1],created_at:a[2],revoked_at:null});return {meta:{changes:1}};}
        if(q.startsWith("DELETE FROM request_nonces")){for(const [key,value] of db.nonces)if(value.expires_at<a[0])db.nonces.delete(key);return {meta:{changes:1}};}
        if(q.startsWith("INSERT INTO request_nonces")){const key=`${a[0]}|${a[1]}`;if(db.nonces.has(key))throw new Error("UNIQUE");db.nonces.set(key,{expires_at:a[2]});return {meta:{changes:1}};}
        if(q.startsWith("INSERT INTO oauth_states")){db.states.set(a[0],{state_hash:a[0],installation_id:a[1],expires_at:a[2],used_at:null});return {meta:{changes:1}};}
        if(q.startsWith("DELETE FROM oauth_states WHERE expires_at")){let changes=0;for(const [key,row] of db.states)if(row.expires_at<a[0]||row.used_at!==null){db.states.delete(key);changes++;}return {meta:{changes}};}
        if(q.startsWith("DELETE FROM oauth_states WHERE state_hash")){const row=db.states.get(a[0]);if(!row||row.used_at!==null)return {meta:{changes:0}};db.states.delete(a[0]);return {meta:{changes:1}};}
        if(q.startsWith("DELETE FROM oauth_states WHERE installation_id")){let changes=0;for(const [key,row] of db.states)if(row.installation_id===a[0]){db.states.delete(key);changes++;}return {meta:{changes}};}
        if(q.startsWith("INSERT INTO strava_connections")){db.connections.set(a[0],{installation_id:a[0],athlete_id:a[1],athlete_name:a[2],access_token_cipher:a[3],refresh_token_cipher:a[4],access_token_expires_at:a[5],scopes:a[6],connected_at:a[7],disconnected_at:null,requires_reauth:0});return {meta:{changes:1}};}
        if(q.startsWith("DELETE FROM strava_connections")){const changed=db.connections.delete(a[0]);return {meta:{changes:changed?1:0}};}
        if(q.startsWith("DELETE FROM strava_uploads")){let changes=0;for(const [key,row] of db.uploads)if(row.installation_id===a[0]){db.uploads.delete(key);changes++;}return {meta:{changes}};}
        if(q.startsWith("UPDATE strava_connections SET access_token_cipher = ?")){const row=db.connections.get(a[3]);Object.assign(row,{access_token_cipher:a[0],refresh_token_cipher:a[1],access_token_expires_at:a[2],requires_reauth:0});return {meta:{changes:1}};}
        if(q.startsWith("UPDATE strava_connections SET requires_reauth")){db.connections.get(a[0]).requires_reauth=1;return {meta:{changes:1}};}
        if(q.startsWith("INSERT INTO strava_uploads")){const key=`${a[0]}|${a[1]}`,old=db.uploads.get(key)||{};db.uploads.set(key,{...old,installation_id:a[0],external_id:a[1],upload_id:a[2],activity_id:old.activity_id||null,state:a[3],last_attempt_at:a[4],last_polled_at:old.last_polled_at||null,last_error:null,uploaded_at:old.uploaded_at||null});return {meta:{changes:1}};}
        if(q.startsWith("UPDATE strava_uploads")){const row=db.uploads.get(`${a[6]}|${a[7]}`);row.state=a[0];if(a[1])row.activity_id=a[1];row.last_error=a[2];if(a[3])row.uploaded_at=a[4];if(a[5])row.last_polled_at=a[5];return {meta:{changes:1}};}
        throw new Error(`Unhandled SQL: ${q}`);
      }
    };}};
  }
  async batch(statements){if(this.failBatch)throw new Error("D1 deletion failed");const results=[];for(const statement of statements)results.push(await statement.run());return results;}
}

const db=new FakeD1(),worker=createWorker(),pwaOrigin="https://example.github.io",workerOrigin="https://road12-strava.example.workers.dev";
const keyPair=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]);
const publicKeyJwk=await crypto.subtle.exportKey("jwk",keyPair.publicKey),installationId=crypto.randomUUID();
let nonceCounter=0;
async function signedRequest(path,{method="GET",body=null,signatureOverride=null,nonceOverride=null}={}){
  const raw=body===null?"":JSON.stringify(body),timestamp=String(Math.floor(Date.now()/1000)),nonce=nonceOverride||`nonce-${++nonceCounter}`,bodyHash=await sha256(raw);
  const signature=signatureOverride||bytesToBase64Url(await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},keyPair.privateKey,new TextEncoder().encode(canonicalRequest(method,path,timestamp,nonce,bodyHash))));
  return new Request(`${workerOrigin}${path}`,{method,headers:{Origin:pwaOrigin,"Content-Type":"application/json","X-Road12-Installation-Id":installationId,"X-Road12-Timestamp":timestamp,"X-Road12-Nonce":nonce,"X-Road12-Signature":signature},body:raw||undefined});
}
const encryptionKey=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
const pwaReturnUrl=`${pwaOrigin}/road-to-12/`;
const env={DB:db,PWA_ORIGIN:pwaOrigin,PWA_RETURN_URL:pwaReturnUrl,OAUTH_REDIRECT_URI:`${workerOrigin}/api/strava/callback`,STRAVA_CLIENT_ID:"client-id",STRAVA_CLIENT_SECRET:"client-secret",TOKEN_ENCRYPTION_KEY:encryptionKey};
const registerBody={installationId,publicKeyJwk};
let response=await worker.fetch(await signedRequest("/api/install/register",{method:"POST",body:registerBody}),env);
assert.equal(response.status,200);
response=await worker.fetch(await signedRequest("/api/install/register",{method:"POST",body:registerBody}),env);
assert.equal(response.status,200,"registration must be idempotent");
response=await worker.fetch(await signedRequest("/api/strava/status",{signatureOverride:"invalid"}),env);
assert.equal(response.status,401);

response=await worker.fetch(await signedRequest("/api/strava/status"),env);
assert.deepEqual(await response.json(),{connected:false,requiresReauth:false,athleteName:null,connectedAt:null});
db.states.set("expired-other-installation",{state_hash:"expired-other-installation",installation_id:"other-installation",expires_at:0,used_at:null});
response=await worker.fetch(await signedRequest("/api/strava/status"),env);
assert.equal(response.status,200);
assert.equal(db.states.has("expired-other-installation"),false,"every Worker request must purge expired OAuth state");
response=await worker.fetch(new Request(`${workerOrigin}/api/strava/status`,{headers:{Origin:`${pwaOrigin}/road-to-12/`}}),env);
assert.equal(response.status,403,"CORS must compare the exact origin without a pathname");
response=await worker.fetch(await signedRequest("/api/strava/connect",{method:"POST",body:{}}),env);
const authorize=await response.json();assert.match(authorize.authorizeUrl,/scope=activity%3Awrite/);
const oauthState=new URL(authorize.authorizeUrl).searchParams.get("state");

const originalFetch=globalThis.fetch;
let uploadCalls=0,pollCalls=0,revokeCalls=0;
globalThis.fetch=async(url,options={})=>{
  const value=String(url);
  if(value.includes("/oauth/token"))return new Response(JSON.stringify({access_token:"access-token",refresh_token:"refresh-token",expires_at:Math.floor(Date.now()/1000)+21600,scope:"activity:write",athlete:{id:123,firstname:"Andy"}}),{status:200,headers:{"Content-Type":"application/json"}});
  if(value.endsWith("/api/v3/uploads")){uploadCalls++;return new Response(JSON.stringify({id_str:"upload-123",activity_id:null}),{status:201,headers:{"Content-Type":"application/json"}});}
  if(value.includes("/api/v3/uploads/upload-123")){pollCalls++;return new Response(JSON.stringify(pollCalls===1?{id_str:"upload-123",activity_id:null,status:"processing"}:{id_str:"upload-123",activity_id:987654}),{status:200,headers:{"Content-Type":"application/json"}});}
  if(value.includes("/oauth/revoke")){revokeCalls++;return new Response(null,{status:200});}
  throw new Error(`Unexpected fetch ${value}`);
};
try{
  response=await worker.fetch(new Request(`${workerOrigin}/api/strava/callback?state=${encodeURIComponent(oauthState)}&error=access_denied`),env);
  assert.equal(response.status,302);
  assert.equal(response.headers.get("Location"),`${pwaReturnUrl}?strava=denied`);
  response=await worker.fetch(new Request(`${workerOrigin}/api/strava/callback?state=${encodeURIComponent(oauthState)}&code=code`),env);
  assert.equal(response.status,302);
  assert.equal(response.headers.get("Location"),`${pwaReturnUrl}?strava=connected`);
  response=await worker.fetch(new Request(`${workerOrigin}/api/strava/callback?state=${encodeURIComponent(oauthState)}&code=code`),env);
  assert.equal(response.status,302,"OAuth state must be one-time-use and return safely to the app");
  assert.equal(response.headers.get("Location"),`${pwaReturnUrl}?strava=error`);
  response=await worker.fetch(await signedRequest("/api/strava/status"),env);
  assert.equal((await response.json()).connected,true);

  const payload={name:"Andy's Home Gym — Full Body A",sportType:"WeightTraining",externalId:"road12-session-route-test",dataType:"json",file:{version:"1.0",start_time:"2026-08-29T18:00:00-04:00",utc_offset:-14400,elapsed_time:3600,sets:[{exercise_type:"SMITH_MACHINE_SQUAT",repetitions:10,weight:40}]}};
  response=await worker.fetch(await signedRequest("/api/strava/upload",{method:"POST",body:payload}),env);
  assert.equal(response.status,202);assert.equal((await response.json()).uploadId,"upload-123");
  response=await worker.fetch(await signedRequest("/api/strava/upload",{method:"POST",body:payload}),env);
  assert.equal(response.status,202);assert.equal(uploadCalls,1,"duplicate external ID must not create another upload");

  const statusPath=`/api/strava/upload/${payload.externalId}/status`;
  response=await worker.fetch(await signedRequest(statusPath),env);assert.equal(response.status,202);assert.equal((await response.json()).state,"SYNCING");
  db.uploads.get(`${installationId}|${payload.externalId}`).last_polled_at=0;
  response=await worker.fetch(await signedRequest(statusPath),env);const completed=await response.json();assert.equal(completed.state,"SYNCED");assert.equal(completed.activityId,"987654");
  db.failBatch=true;
  response=await worker.fetch(await signedRequest("/api/strava/disconnect",{method:"POST",body:{}}),env);assert.equal(response.status,500);
  assert.equal((await response.json()).code,"REQUEST_FAILED","failed deletion must not report confirmation");
  assert.equal(db.connections.has(installationId),true,"failed deletion must not partially remove connection data");
  assert.equal(db.uploads.size,1,"failed deletion must not partially remove upload data");
  db.failBatch=false;
  response=await worker.fetch(await signedRequest("/api/strava/disconnect",{method:"POST",body:{}}),env);assert.equal(response.status,200);assert.equal(revokeCalls,2);
  const deletion=await response.json();assert.equal(deletion.deletionConfirmed,true);assert.equal(deletion.deleted,true);
  assert.equal(db.connections.has(installationId),false,"disconnect must delete athlete identity and token row");
  assert.equal(db.uploads.size,0,"disconnect must delete upload and activity identifiers");
  assert.equal([...db.states.values()].some(row=>row.installation_id===installationId),false,"disconnect must delete OAuth state rows");
  response=await worker.fetch(await signedRequest("/api/strava/status"),env);assert.equal((await response.json()).connected,false);

  const replayNonce="replay";
  const first=await signedRequest("/api/strava/status",{nonceOverride:replayNonce});
  response=await worker.fetch(first,env);assert.equal(response.status,200);
  const second=await signedRequest("/api/strava/status",{nonceOverride:replayNonce});
  response=await worker.fetch(second,env);assert.equal(response.status,401,"replayed signed request must be rejected");
}finally{globalThis.fetch=originalFetch;}

console.log("Strava Phase 2A Worker route, OAuth, idempotency, polling, reconciliation, replay, and disconnect tests passed.");
