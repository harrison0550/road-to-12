const encoder=new TextEncoder();
const decoder=new TextDecoder();
export const bytesToBase64Url=bytes=>{
  let binary="";
  new Uint8Array(bytes).forEach(value=>{binary+=String.fromCharCode(value);});
  return btoa(binary).replaceAll("+","-").replaceAll("/","_").replace(/=+$/g,"");
};
export const base64UrlToBytes=value=>{
  const padded=String(value).replaceAll("-","+").replaceAll("_","/").padEnd(Math.ceil(String(value).length/4)*4,"=");
  const binary=atob(padded),bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  return bytes;
};
export const sha256=async value=>bytesToBase64Url(await crypto.subtle.digest("SHA-256",encoder.encode(value)));
export const canonicalRequest=(method,path,timestamp,nonce,bodyHash)=>[method.toUpperCase(),path,timestamp,nonce,bodyHash].join("\n");
export async function importInstallationPublicKey(jwk){
  if(jwk?.kty!=="EC"||jwk?.crv!=="P-256"||!jwk?.x||!jwk?.y)throw new Error("INVALID_INSTALLATION_KEY");
  return crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:"P-256"},false,["verify"]);
}
export async function verifyInstallationSignature({jwk,method,path,timestamp,nonce,body,signature}){
  const key=await importInstallationPublicKey(jwk);
  const bodyHash=await sha256(body||"");
  return crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},key,base64UrlToBytes(signature),encoder.encode(canonicalRequest(method,path,timestamp,nonce,bodyHash)));
}
function encryptionKeyBytes(secret){
  const bytes=base64UrlToBytes(secret);
  if(bytes.byteLength!==32)throw new Error("TOKEN_ENCRYPTION_KEY must be a base64url-encoded 32-byte key.");
  return bytes;
}
async function tokenKey(secret,usage){return crypto.subtle.importKey("raw",encryptionKeyBytes(secret),"AES-GCM",false,[usage]);}
export async function encryptToken(token,secret){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv},await tokenKey(secret,"encrypt"),encoder.encode(token));
  return `v1.${bytesToBase64Url(iv)}.${bytesToBase64Url(ciphertext)}`;
}
export async function decryptToken(value,secret){
  const [version,iv,ciphertext]=String(value||"").split(".");
  if(version!=="v1"||!iv||!ciphertext)throw new Error("INVALID_TOKEN_CIPHER");
  const plaintext=await crypto.subtle.decrypt({name:"AES-GCM",iv:base64UrlToBytes(iv)},await tokenKey(secret,"decrypt"),base64UrlToBytes(ciphertext));
  return decoder.decode(plaintext);
}
export function randomOpaque(bytes=32){return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));}
