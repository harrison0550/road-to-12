(function(root,factory){
  const api=factory(root);
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  root.ROAD12_STRAVA_CLIENT=api;
})(typeof self!=="undefined"?self:globalThis,function(root){
  const STORAGE_KEY="road12-strava-installation-v1";
  const encoder=new TextEncoder();
  const base64Url=bytes=>{
    let binary="";
    new Uint8Array(bytes).forEach(value=>{binary+=String.fromCharCode(value);});
    return btoa(binary).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"");
  };
  const configured=()=>{
    const value=String(root.ROAD12_STRAVA_CONFIG?.workerBaseUrl||"").replace(/\/$/,"");
    if(!value)return null;
    const url=new URL(value,root.location?.href||"https://localhost/");
    if(url.protocol!=="https:"&&!(["localhost","127.0.0.1"].includes(url.hostname)))return null;
    return url.origin+url.pathname.replace(/\/$/,"");
  };
  async function generateInstallation(){
    const keyPair=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},true,["sign","verify"]);
    return {
      installationId:crypto.randomUUID(),
      privateKeyJwk:await crypto.subtle.exportKey("jwk",keyPair.privateKey),
      publicKeyJwk:await crypto.subtle.exportKey("jwk",keyPair.publicKey),
      registered:false
    };
  }
  function readInstallation(){
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      return value?.installationId&&value?.privateKeyJwk&&value?.publicKeyJwk?value:null;
    }catch{return null;}
  }
  function writeInstallation(value){localStorage.setItem(STORAGE_KEY,JSON.stringify(value));return value;}
  async function installation(){return readInstallation()||writeInstallation(await generateInstallation());}
  async function sha256(value){return base64Url(await crypto.subtle.digest("SHA-256",encoder.encode(value)));}
  function canonicalRequest(method,path,timestamp,nonce,bodyHash){return [method.toUpperCase(),path,timestamp,nonce,bodyHash].join("\n");}
  async function signedHeaders(method,path,body,credentials){
    const timestamp=String(Math.floor(Date.now()/1000)),nonce=crypto.randomUUID(),bodyHash=await sha256(body||"");
    const privateKey=await crypto.subtle.importKey("jwk",credentials.privateKeyJwk,{name:"ECDSA",namedCurve:"P-256"},false,["sign"]);
    const signature=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},privateKey,encoder.encode(canonicalRequest(method,path,timestamp,nonce,bodyHash)));
    return {
      "X-Road12-Installation-Id":credentials.installationId,
      "X-Road12-Timestamp":timestamp,
      "X-Road12-Nonce":nonce,
      "X-Road12-Signature":base64Url(signature)
    };
  }
  async function request(path,{method="GET",body=null,register=false}={}){
    const base=configured();
    if(!base)throw Object.assign(new Error("Strava proof-of-concept is not configured on this build."),{code:"NOT_CONFIGURED"});
    const credentials=await installation();
    const serialized=body===null?"":JSON.stringify(body);
    const headers={Accept:"application/json"};
    if(serialized)headers["Content-Type"]="application/json";
    Object.assign(headers,await signedHeaders(method,path,serialized,credentials));
    const response=await fetch(`${base}${path}`,{method,headers,body:serialized||undefined,cache:"no-store",credentials:"omit"});
    let result={};
    try{result=await response.json();}catch{}
    if(!response.ok){
      const error=new Error(result.message||"Strava connection request failed.");
      error.code=result.code||`HTTP_${response.status}`;
      error.status=response.status;
      error.result=result;
      throw error;
    }
    if(register&&!credentials.registered)writeInstallation(Object.assign({},credentials,{registered:true}));
    return result;
  }
  async function ensureRegistered(){
    const credentials=await installation();
    if(credentials.registered)return credentials;
    await request("/api/install/register",{method:"POST",body:{installationId:credentials.installationId,publicKeyJwk:credentials.publicKeyJwk},register:true});
    return readInstallation();
  }
  async function authenticatedRequest(path,options={}){await ensureRegistered();return request(path,options);}
  const status=()=>authenticatedRequest("/api/strava/status");
  const connect=()=>authenticatedRequest("/api/strava/connect",{method:"POST",body:{}});
  const disconnect=()=>authenticatedRequest("/api/strava/disconnect",{method:"POST",body:{}});
  const upload=payload=>authenticatedRequest("/api/strava/upload",{method:"POST",body:payload});
  const uploadStatus=externalId=>authenticatedRequest(`/api/strava/upload/${encodeURIComponent(externalId)}/status`);
  return Object.freeze({STORAGE_KEY,configured,generateInstallation,readInstallation,installation,sha256,canonicalRequest,signedHeaders,ensureRegistered,status,connect,disconnect,upload,uploadStatus});
});
