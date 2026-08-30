export const nowSeconds=()=>Math.floor(Date.now()/1000);
export async function installationById(db,id){return db.prepare("SELECT * FROM installations WHERE id = ?").bind(id).first();}
export async function registerInstallation(db,{id,publicKeyJwk,now}){
  const existing=await installationById(db,id);
  const serialized=JSON.stringify(publicKeyJwk);
  if(existing){
    if(existing.public_key_jwk!==serialized)throw Object.assign(new Error("This installation ID is already registered with different credentials."),{code:"CREDENTIAL_MISMATCH",status:409});
    return existing;
  }
  await db.prepare("INSERT INTO installations (id, public_key_jwk, created_at, revoked_at) VALUES (?, ?, ?, NULL)").bind(id,serialized,now).run();
  return installationById(db,id);
}
export async function consumeNonce(db,{installationId,nonce,expiresAt,now}){
  await db.prepare("DELETE FROM request_nonces WHERE expires_at < ?").bind(now).run();
  try{
    await db.prepare("INSERT INTO request_nonces (installation_id, nonce, expires_at) VALUES (?, ?, ?)").bind(installationId,nonce,expiresAt).run();
    return true;
  }catch{return false;}
}
export async function createOauthState(db,{stateHash,installationId,expiresAt}){
  await db.prepare("INSERT INTO oauth_states (state_hash, installation_id, expires_at, used_at) VALUES (?, ?, ?, NULL)").bind(stateHash,installationId,expiresAt).run();
}
export async function consumeOauthState(db,{stateHash,now}){
  const record=await db.prepare("SELECT * FROM oauth_states WHERE state_hash = ?").bind(stateHash).first();
  if(!record||record.used_at||record.expires_at<now)return null;
  const result=await db.prepare("UPDATE oauth_states SET used_at = ? WHERE state_hash = ? AND used_at IS NULL").bind(now,stateHash).run();
  return result?.meta?.changes===1?record:null;
}
export async function connectionByInstallation(db,installationId){return db.prepare("SELECT * FROM strava_connections WHERE installation_id = ?").bind(installationId).first();}
export async function saveConnection(db,record){
  await db.prepare(`INSERT INTO strava_connections
    (installation_id, athlete_id, athlete_name, access_token_cipher, refresh_token_cipher, access_token_expires_at, scopes, connected_at, disconnected_at, requires_reauth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)
    ON CONFLICT(installation_id) DO UPDATE SET athlete_id=excluded.athlete_id, athlete_name=excluded.athlete_name,
    access_token_cipher=excluded.access_token_cipher, refresh_token_cipher=excluded.refresh_token_cipher,
    access_token_expires_at=excluded.access_token_expires_at, scopes=excluded.scopes, connected_at=excluded.connected_at,
    disconnected_at=NULL, requires_reauth=0`).bind(record.installationId,record.athleteId,record.athleteName,record.accessTokenCipher,record.refreshTokenCipher,record.expiresAt,record.scopes,record.connectedAt).run();
}
export async function updateConnectionTokens(db,record){
  await db.prepare("UPDATE strava_connections SET access_token_cipher = ?, refresh_token_cipher = ?, access_token_expires_at = ?, requires_reauth = 0 WHERE installation_id = ?")
    .bind(record.accessTokenCipher,record.refreshTokenCipher,record.expiresAt,record.installationId).run();
}
export async function requireReauth(db,installationId){await db.prepare("UPDATE strava_connections SET requires_reauth = 1 WHERE installation_id = ?").bind(installationId).run();}
export async function disconnect(db,installationId,now){
  await db.prepare("UPDATE strava_connections SET access_token_cipher = NULL, refresh_token_cipher = NULL, access_token_expires_at = NULL, disconnected_at = ?, requires_reauth = 0 WHERE installation_id = ?").bind(now,installationId).run();
}
export async function uploadByExternalId(db,installationId,externalId){return db.prepare("SELECT * FROM strava_uploads WHERE installation_id = ? AND external_id = ?").bind(installationId,externalId).first();}
export async function markUploadStarted(db,{installationId,externalId,uploadId,state,now}){
  await db.prepare(`INSERT INTO strava_uploads (installation_id, external_id, upload_id, activity_id, state, last_attempt_at, last_polled_at, last_error, uploaded_at)
    VALUES (?, ?, ?, NULL, ?, ?, NULL, NULL, NULL)
    ON CONFLICT(installation_id, external_id) DO UPDATE SET upload_id=excluded.upload_id, state=excluded.state,
    last_attempt_at=excluded.last_attempt_at, last_error=NULL`).bind(installationId,externalId,uploadId,state,now).run();
}
export async function markUploadState(db,{installationId,externalId,state,activityId=null,lastError=null,now,lastPolledAt=null}){
  await db.prepare(`UPDATE strava_uploads SET state = ?, activity_id = COALESCE(?, activity_id), last_error = ?,
    uploaded_at = CASE WHEN ? IS NOT NULL THEN ? ELSE uploaded_at END,
    last_polled_at = COALESCE(?, last_polled_at) WHERE installation_id = ? AND external_id = ?`)
    .bind(state,activityId,lastError,activityId,now,lastPolledAt,installationId,externalId).run();
}
