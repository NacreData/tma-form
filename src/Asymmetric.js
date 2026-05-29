
import { Base64 } from 'js-base64';

const arrayBufferToString = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const stringToArrayBuffer = (str) => {
    const buf = new ArrayBuffer(str.length); 
    const bufView = new Uint8Array(buf);
    for (let i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
};

const wrapString = (str) => {
  return Base64.encode(str);
};

const unwrapString = (str) => {
  return Base64.decode(str);
};

const wrap = (buf) => { return wrapString(arrayBufferToString(buf)); }

const unwrap = (str) => { return stringToArrayBuffer(unwrapString(str)); }

const genAsymmetricKey = async (subtle) => {
  const keyPair = await subtle.generateKey('X25519', true, ['deriveKey',]);
  
  return keyPair;
};

const deriveKey = async (toPubKey, fromPrivKey, subtle) => {  
  const gcmKey = await subtle.deriveKey(
    {name: 'X25519', public: toPubKey},
    fromPrivKey,
    {name: 'AES-GCM', length: 256},
    true,
    ['encrypt', 'decrypt']
  );
  
  return gcmKey;
};

const makeIV = () => {
  const array = new Uint8Array(12);
  return window.crypto.getRandomValues(array);
};

const encrypt = async (str, key, auth, subtle=window.crypto.subtle) => {
  if ('' === str) { return ''; }
  
  if ('object' === typeof(str)) { 
    str = JSON.stringify(str);
  }

  const enc    = new TextEncoder();
  
  const iv     = makeIV();
  
  const encStr = enc.encode(str);
  
  const buff   = await subtle.encrypt({ 
    name           : 'AES-GCM', 
    iv             : iv, 
    additionalData : stringToArrayBuffer(auth),
    tagLength      : 128    
  }, key, encStr);
  
  return wrapString(arrayBufferToString(iv)) + '-' + wrapString(arrayBufferToString(buff));
};

const decrypt = async (str, key, auth, subtle=window.crypto.subtle) => {
  if ('' === str) { return ''; }
  
  const dec    = new TextDecoder();

  const [wrappedIV, wrappedStr] = str.split('-');
  
  const iv     = unwrap(wrappedIV);
  
  const buff   = await subtle.decrypt({ 
    name           : 'AES-GCM', 
    iv             : iv, 
    additionalData : stringToArrayBuffer(auth),
    tagLength      : 128    
  }, key, unwrap(wrappedStr));
  
  const decode = dec.decode(buff);

  try {
    return JSON.parse(decode);
  }
  catch (e) {
    return decode;
  }  
};

const ndhash = async (pwd, len=16, salt=false) => {
  const s = salt ? unwrap(salt) : window.crypto.getRandomValues(new Uint8Array(16));
  const h = await argon2.hash({ pass: pwd, salt: s, time: 11, mem: 4096, hashLen: len, type: 'Argon2id' });
  
  return [s, h.hash];
};

const passKey = async (pass, salt=false) => {
  const [s, h] = await ndhash(pass, 32, salt);  
  const k      = await window.crypto.subtle.importKey("raw", h, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
    
  return [wrap(s), k];
};

const aad = (input) => {
  return PAE(
    input.concat( [window.location.host, window.location.href, 'tma-form',] )
  );
};

export const encryptSubmission = async (d) => {

  // additional authentication data
  const haad      = aad([d.pubMaster, d.endpoint, 'submission']);
  
  const subtle    = window.crypto.subtle;
  
  const keyPair   = await genAsymmetricKey(subtle);
  
  const pubMJSON  = JSON.parse(unwrapString(d.pubMaster));
  
  const pubM      = await subtle.importKey('jwk', pubMJSON, 'X25519', false, []);
  
  const sKey      = await deriveKey(pubM, keyPair.privateKey, subtle);
  
  // clean up data to save and convert it to a string
  const data      = JSON.parse(JSON.stringify(d)); // deep copy
  data.pubMaster  = undefined;
  data.endpoint   = undefined;
  data.page       = undefined;
  data.err        = undefined; 
  data.loading    = undefined;
  
  const dataStr   = JSON.stringify(data);
  
  const encData   = await encrypt(dataStr, sKey, haad, subtle);
  
  const pubU      = wrapString(JSON.stringify(await subtle.exportKey('jwk', keyPair.publicKey)));
  
  const toSave    = [pubU, encData].join('-');
  
  console.log(toSave);
};

// https://soatok.blog/2021/07/30/canonicalization-attacks-against-macs-and-signatures/#pae
const LE64 = (n) => {
    let str = '';
    for (let i = 0; i < 8; ++i) {
        if (i === 7) {
            // Clear the MSB for interoperability
            n &= 127;
        }
        str += String.fromCharCode(n & 255);
        n = n >>> 8;
    }
    return str;
}
 
const PAE = (pieces) => {
    if (!Array.isArray(pieces)) {
        throw TypeError('Expected an array.');
    }
    const count  = pieces.length;
    let   output = LE64(count);
    for (let i = 0; i < count; i++) {
        output += LE64(pieces[i].length);
        /*** Soatok Note: 
         This JS pseudocode incorrectly assumes strings, rather than buffers.
         It's only meant to illustrate the idea.
         In real implementations, don't join Buffers with +.
         ***/
        output += pieces[i];
    }
    return output;
}

/* 
export const makeMaster = async () => {
  const subtle    = window.crypto.subtle;
  const keyPair   = await genAsymmetricKey(subtle);
  const privM     = wrapString(JSON.stringify(await subtle.exportKey('jwk', keyPair.privateKey)));
  console.log(privM);
  const pubM      = wrapString(JSON.stringify(await subtle.exportKey('jwk', keyPair.publicKey)));
  console.log(pubM);
  
  return true;
};

export const asymmTest = async () => {

  const subtle = window.crypto.subtle;
  
  // Steps 1-5 are done offline for the first privileged user. 
  // for subsequent users, an existing user will add the new user's User Name and email 
  // from there a temp password will be autogenerated and emailed to the user. 
  // when the user changes their password, a new version of these will be generated. 

  // 1. Generalte Public, Private master key pair
  let keyPairM = await genAsymmetricKey(subtle);
  
  // 2. Export Private key to a string in preparation for encrypting it. 
  let priv = JSON.stringify(await subtle.exportKey('jwk', keyPairM.privateKey));
  
  // 3. Generate a password-derived key 
  let [salt1, passDerivedKey] = await passKey('Kropotkin'); 
  
  // 4. Generate hash of password to use in authenticated associated data
  let [salt2, hash] = await ndhash('Kropotkin', 32);
  
  // 5. Encrypt the master Private key. 
  const encPriv = await encrypt(priv, passDerivedKey, arrayBufferToString(hash), subtle);
  
  passDerivedKey = undefined;
  hash    = undefined;
  priv    = undefined; 

  // The following are stored in the database, with a database key of the users User Name:
  // encPriv, salt1, salt2
  
  // 6. In normal usage this public key would be retrieved from the server
  const pub = keyPairM.publicKey;
  keyPairM  = undefined;
  
  
  // 7. Generate a keypair for saving data 
  let keyPairU   = await genAsymmetricKey(subtle);
  
  // 8. Deive the key to use for encrypting the data. 
  const derivedKey = await deriveKey(pub, keyPairU.privateKey, subtle);
  
  // 9. The new public key will be stored along with the encrypted data. Delete priv key. 
  const pubU = keyPairU.publicKey;
  keyPairU   = undefined; 
  
  // 10. encrypt test data with derived key
  //     the resulting encrypted data can be saved along with the public key, pubU
  const enc = await encrypt('test phrase', derivedKey, '', subtle);
  
  // theoretical break across time and space here while a privileged user signs in later
  // to read the saved data. 
  
  // When the user provides their User Name, the following is 
  // retrieved from the database: 
  // encPriv, [their version of the encrypted master private key]
  // salt1,   [the salt used in creating the password-derived key]
  // salt2,   [the salt used in creating the password hash]
  // all the encrypted data, each bit with it's own attached public key, pubU in this example
  
  // 11. Retrieve password-derived key 
  const [s1, passKeyRetrieved] = await passKey('Kropotkin', salt1); 

  // 12. Retrieve hash of password to use in authenticated associated data
  const [s2, hashRetrieved] = await ndhash('Kropotkin', 32, wrap(salt2));
  
  // 13. Decrypt master private key as exported 'jwt' format
  const privRetrieved = await decrypt(encPriv, passKeyRetrieved, arrayBufferToString(hashRetrieved), subtle); 
  
  // 14. Import the master private key into usable form 
  const privMRetrieved = await subtle.importKey('jwk', privRetrieved, 'X25519', false, ['deriveKey',]);
  
  // 15. derive the actual encryption key from the provided pub key and retrieved priv key
  const derivedKey2 = await deriveKey(pubU, privMRetrieved, subtle);
  
  // 16. decrypt the actual data 
  const dec = await decrypt(enc, derivedKey2, '', subtle);
  
  console.log(dec);
  // prints "test phrase"
};
 */
