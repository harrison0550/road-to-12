import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
import {ALLOWED_EXERCISES,hasProhibitedFields,validateUploadPayload} from "../worker/strava/src/contract.mjs";
import {bytesToBase64Url,decryptToken,encryptToken,sha256,verifyInstallationSignature} from "../worker/strava/src/security.mjs";
import {getValidStravaAccessToken,pollUpload,revokeToken,submitStrengthUpload} from "../worker/strava/src/strava-api.mjs";
import {consumeNonce,consumeOauthState,createOauthState,markUploadStarted,markUploadState,registerInstallation,uploadByExternalId} from "../worker/strava/src/repository.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const validPayload=()=>({
  name:"Andy's Home Gym — Full Body A",sportType:"WeightTraining",externalId:"road12-session-phase2a",dataType:"json",
  file:{version:"1.0",start_time:"2026-08-29T18:00:00-04:00",utc_offset:-14400,elapsed_time:3600,sets:[{exercise_type:"SMITH_MACHINE_SQUAT",repetitions:10,weight:40.823}]}
});

assert.equal(validateUploadPayload(validPayload()).valid,true);
assert.equal(ALLOWED_EXERCISES.has("SMITH_MACHINE_SQUAT"),true);
for(const mutation of [
  value=>{value.name="Road to 12% — Full Body A";},
  value=>{value.sportType="Run";},
  value=>{value.dataType="gpx";},
  value=>{value.externalId="bad";},
  value=>{value.file.version="2.0";},
  value=>{value.file.start_time="2026-08-29T18:00:00";},
  value=>{value.file.sets[0].exercise_type="INVENTED_EXERCISE";},
  value=>{value.file.sets[0].repetitions=0;},
  value=>{value.privateNotes="body-fat goal";}
]){
  const payload=validPayload();mutation(payload);assert.equal(validateUploadPayload(payload).valid,false);
}
assert.equal(hasProhibitedFields({exercise:{RIR:2}}),true);
assert.equal(hasProhibitedFields({file:{sets:[{repetitions:10}]}}),false);
const oversized=validPayload();oversized.padding="x".repeat(262145);assert.equal(validateUploadPayload(oversized).valid,false);

const encryptionKey=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)));
const cipher=await encryptToken("refresh-secret",encryptionKey);
assert.notEqual(cipher.includes("refresh-secret"),true);
assert.equal(await decryptToken(cipher,encryptionKey),"refresh-secret");
await assert.rejects(()=>decryptToken(cipher,bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32)))));

const signingPair=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]);
const publicKeyJwk=await crypto.subtle.exportKey("jwk",signingPair.publicKey);
const body=JSON.stringify({installationId:"test"}),timestamp="1788048000",nonce="nonce-1",requestPath="/api/install/register";
const bodyHash=await sha256(body),message=["POST",requestPath,timestamp,nonce,bodyHash].join("\n");
const signature=bytesToBase64Url(await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},signingPair.privateKey,new TextEncoder().encode(message)));
assert.equal(await verifyInstallationSignature({jwk:publicKeyJwk,method:"POST",path:requestPath,timestamp,nonce,body,signature}),true);
assert.equal(await verifyInstallationSignature({jwk:publicKeyJwk,method:"POST",path:requestPath,timestamp,nonce,body:`${body} `,signature}),false);

class FakeD1{
  constructor(){this.installations=new Map();this.nonces=new Map();this.states=new Map();this.uploads=new Map();}
  prepare(sql){
    const db=this,normalized=sql.replace(/\s+/g," ").trim();
    return {bind(...args){return {
      async first(){
        if(normalized.startsWith("SELECT * FROM installations"))return db.installations.get(args[0])||null;
        if(normalized.startsWith("SELECT * FROM oauth_states"))return db.states.get(args[0])||null;
        if(normalized.startsWith("SELECT * FROM strava_uploads"))return db.uploads.get(`${args[0]}|${args[1]}`)||null;
        return null;
      },
      async run(){
        if(normalized.startsWith("INSERT INTO installations")){db.installations.set(args[0],{id:args[0],public_key_jwk:args[1],created_at:args[2],revoked_at:null});return {meta:{changes:1}};}
        if(normalized.startsWith("DELETE FROM request_nonces")){for(const [key,value] of db.nonces)if(value.expires_at<args[0])db.nonces.delete(key);return {meta:{changes:1}};}
        if(normalized.startsWith("INSERT INTO request_nonces")){const key=`${args[0]}|${args[1]}`;if(db.nonces.has(key))throw new Error("UNIQUE");db.nonces.set(key,{installation_id:args[0],nonce:args[1],expires_at:args[2]});return {meta:{changes:1}};}
        if(normalized.startsWith("INSERT INTO oauth_states")){db.states.set(args[0],{state_hash:args[0],installation_id:args[1],expires_at:args[2],used_at:null});return {meta:{changes:1}};}
        if(normalized.startsWith("DELETE FROM oauth_states WHERE expires_at")){let changes=0;for(const [key,row] of db.states)if(row.expires_at<args[0]||row.used_at!==null){db.states.delete(key);changes++;}return {meta:{changes}};}
        if(normalized.startsWith("DELETE FROM oauth_states WHERE state_hash")){const record=db.states.get(args[0]);if(!record||record.used_at!==null)return {meta:{changes:0}};db.states.delete(args[0]);return {meta:{changes:1}};}
        if(normalized.startsWith("INSERT INTO strava_uploads")){const key=`${args[0]}|${args[1]}`,old=db.uploads.get(key)||{};db.uploads.set(key,{...old,installation_id:args[0],external_id:args[1],upload_id:args[2],activity_id:old.activity_id||null,state:args[3],last_attempt_at:args[4],last_polled_at:old.last_polled_at||null,last_error:null,uploaded_at:old.uploaded_at||null});return {meta:{changes:1}};}
        if(normalized.startsWith("UPDATE strava_uploads")){const record=db.uploads.get(`${args[6]}|${args[7]}`);record.state=args[0];if(args[1])record.activity_id=args[1];record.last_error=args[2];if(args[3])record.uploaded_at=args[4];if(args[5])record.last_polled_at=args[5];return {meta:{changes:1}};}
        throw new Error(`Unhandled SQL: ${normalized}`);
      }
    };}};
  }
}
const db=new FakeD1(),now=1788048000;
const registered=await registerInstallation(db,{id:"install-1",publicKeyJwk,now});
assert.equal(registered.id,"install-1");
assert.equal((await registerInstallation(db,{id:"install-1",publicKeyJwk,now})).id,"install-1");
await assert.rejects(()=>registerInstallation(db,{id:"install-1",publicKeyJwk:{...publicKeyJwk,x:"different"},now}),error=>error.code==="CREDENTIAL_MISMATCH");
assert.equal(await consumeNonce(db,{installationId:"install-1",nonce:"one",expiresAt:now+600,now}),true);
assert.equal(await consumeNonce(db,{installationId:"install-1",nonce:"one",expiresAt:now+600,now}),false);
await createOauthState(db,{stateHash:"state",installationId:"install-1",expiresAt:now+600});
assert.equal((await consumeOauthState(db,{stateHash:"state",now})).installation_id,"install-1");
assert.equal(await consumeOauthState(db,{stateHash:"state",now}),null);
await createOauthState(db,{stateHash:"expired",installationId:"install-1",expiresAt:now-1});
assert.equal(await consumeOauthState(db,{stateHash:"expired",now}),null);
await markUploadStarted(db,{installationId:"install-1",externalId:"road12-session-phase2a",uploadId:"upload-1",state:"SYNCING",now});
assert.equal((await uploadByExternalId(db,"install-1","road12-session-phase2a")).upload_id,"upload-1");
await markUploadState(db,{installationId:"install-1",externalId:"road12-session-phase2a",state:"SYNCED",activityId:"activity-1",now,lastPolledAt:now});
assert.equal((await uploadByExternalId(db,"install-1","road12-session-phase2a")).activity_id,"activity-1");

let capturedUpload;
const uploadResult=await submitStrengthUpload({accessToken:"access",payload:validPayload(),fetchImpl:async(url,options)=>{capturedUpload={url,options};return new Response(JSON.stringify({id_str:"upload-2",status:"Your activity is still being processed."}),{status:201,headers:{"Content-Type":"application/json"}});}});
assert.equal(uploadResult.id_str,"upload-2");
assert.equal(capturedUpload.url,"https://www.strava.com/api/v3/uploads");
assert.equal(capturedUpload.options.headers.Authorization,"Bearer access");
assert.equal(capturedUpload.options.body.get("data_type"),"json");
assert.equal(capturedUpload.options.body.get("sport_type"),"WeightTraining");
assert.equal(capturedUpload.options.body.get("external_id"),"road12-session-phase2a");
assert.equal(JSON.parse(await capturedUpload.options.body.get("file").text()).version,"1.0");
await assert.rejects(()=>submitStrengthUpload({accessToken:"access",payload:validPayload(),fetchImpl:async()=>new Response(JSON.stringify({message:"bad"}),{status:400,headers:{"Content-Type":"application/json"}})}),error=>error.code==="STRAVA_REJECTED");
await assert.rejects(()=>submitStrengthUpload({accessToken:"access",payload:validPayload(),fetchImpl:async()=>new Response(JSON.stringify({message:"limited"}),{status:429,headers:{"Content-Type":"application/json","Retry-After":"30","X-RateLimit-Limit":"200,2000","X-RateLimit-Usage":"200,500"}})}),error=>error.code==="STRAVA_RATE_LIMITED"&&error.retryAfter===30&&error.rateLimit==="200,2000");
assert.equal((await pollUpload({accessToken:"access",uploadId:"upload-2",fetchImpl:async()=>new Response(JSON.stringify({activity_id:123}),{status:200,headers:{"Content-Type":"application/json"}})})).activity_id,123);

const tokenDb={prepare(){return {bind(){return {async run(){return {meta:{changes:1}};}};}};}};
const env={DB:tokenDb,TOKEN_ENCRYPTION_KEY:encryptionKey,STRAVA_CLIENT_ID:"client",STRAVA_CLIENT_SECRET:"secret"};
const unexpiredConnection={installation_id:"install-1",refresh_token_cipher:await encryptToken("refresh",encryptionKey),access_token_cipher:await encryptToken("existing-access",encryptionKey),access_token_expires_at:now+7200};
assert.equal(await getValidStravaAccessToken({env,connection:unexpiredConnection,now,fetchImpl:async()=>{throw new Error("must not refresh");}}),"existing-access");
const expiredConnection={...unexpiredConnection,access_token_expires_at:now};
assert.equal(await getValidStravaAccessToken({env,connection:expiredConnection,now,fetchImpl:async()=>new Response(JSON.stringify({access_token:"new-access",refresh_token:"new-refresh",expires_at:now+21600}),{status:200,headers:{"Content-Type":"application/json"}})}),"new-access");
await assert.rejects(()=>getValidStravaAccessToken({env,connection:expiredConnection,now,fetchImpl:async()=>new Response("{}",{status:401})}),error=>error.code==="REAUTH_REQUIRED");
let revokeRequest;
await revokeToken({env,token:"refresh",fetchImpl:async(url,options)=>{revokeRequest={url,options};return new Response(null,{status:200});}});
assert.equal(revokeRequest.url,"https://www.strava.com/oauth/revoke");
assert.match(revokeRequest.options.headers.Authorization,/^Basic /);

const app=fs.readFileSync(path.join(root,"app.js"),"utf8"),client=fs.readFileSync(path.join(root,"strava-client.js"),"utf8"),index=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8"),backup=fs.readFileSync(path.join(root,"backup-restore.js"),"utf8"),worker=fs.readFileSync(path.join(root,"worker/strava/src/index.mjs"),"utf8");
assert(index.includes("strava-config.js")&&index.includes("strava-client.js"));
assert(sw.includes('"./strava-config.js"')&&sw.includes('"./strava-client.js"'));
assert(app.includes("Connect Strava")&&app.includes("Post to Strava")&&app.includes("This will create a real activity on Strava.")&&app.includes("View on Strava"));
assert(app.includes("Post unavailable while offline")&&app.includes("Automatic sync, activity reading, and cardio posting are off."));
assert(app.includes("Strava &amp; Privacy")&&app.includes("I understand what is stored")&&app.includes("Road to 12% support page"),"privacy and support disclosure must be visible before OAuth");
assert(app.includes("applyConfirmedStravaDeletion(result)")&&app.includes("if(!result?.deleted||!result?.deletionConfirmed"),"local deletion must wait for backend confirmation");
assert(app.includes("Historical reposting is disabled"),"deleted historical workouts must not become repost candidates");
assert(app.includes("state.history.map(window.ROAD12_STRAVA_DATA.stripSession)"),"Strava provider metadata must be removed before coaching analysis");
assert(!/setInterval\([^)]*strava|sync on workout completion/i.test(app));
assert(!backup.includes("road12-strava-installation-v1"));
assert(!/STRAVA_CLIENT_SECRET|refresh_token|access_token/.test(client),"browser client must not contain provider credential fields");
assert(!/console\.(?:log|warn|error)\([^)]*(?:token|secret)/i.test(worker));
assert.equal(fs.readFileSync(path.join(root,"strava-config.js"),"utf8").includes('workerBaseUrl:"https://road12-strava-phase2a.homegym-sync.workers.dev"'),true,"pilot config must point only at the reviewed HTTPS Worker");

const require=createRequire(import.meta.url),sync=require("../strava-sync-state.js");
const identities=require("../exercise-identity.js");
const browserTokens=[...new Set(identities.definitions.map(item=>item.externalMappings.strava.exerciseType).filter(Boolean))].sort();
assert.deepEqual([...ALLOWED_EXERCISES].sort(),browserTokens,"Worker allowlist must exactly match the validated Phase 1 token contract");
let local=sync.transition({status:"NOT_SYNCED",externalId:"road12-session-phase2a"},"QUEUED");
local=sync.transition(local,"SYNCING",{uploadId:"upload-1"});
local=sync.reconcile(local,{state:"SYNCED",activityId:"activity-1",uploadedAt:"2026-08-29T23:00:00.000Z"});
assert.equal(local.status,"SYNCED");assert.equal(local.activityId,"activity-1");
assert.equal(sync.reconcile(local,{state:"FAILED",lastError:"older failure"}).status,"SYNCED","backend reconciliation cannot downgrade confirmed sync");
assert.equal(sync.reconcile({status:"SYNCING"},{state:"FAILED",lastError:"provider failed"}).status,"FAILED");
console.log("Strava Phase 2A security, contract, storage, provider, UI, offline, and privacy tests passed.");
