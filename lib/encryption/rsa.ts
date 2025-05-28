import JSEncrypt from 'jsencrypt';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateRSAKeyPair = (): RSAKeyPair => {
  const encrypt = new JSEncrypt({ default_key_size: '2048' });
  return {
    publicKey: encrypt.getPublicKey(),
    privateKey: encrypt.getPrivateKey()
  };
};

export const rsaEncrypt = (message: string, publicKey: string): { ciphertext: string, time: number } => {
  const startTime = performance.now();
  
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encrypted = encrypt.encrypt(message);
  
  const endTime = performance.now();
  
  return {
    ciphertext: encrypted || '',
    time: endTime - startTime
  };
};

export const rsaDecrypt = (ciphertext: string, privateKey: string): { plaintext: string, time: number } => {
  const startTime = performance.now();
  
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const decrypted = decrypt.decrypt(ciphertext);
  
  const endTime = performance.now();
  
  return {
    plaintext: decrypted || '',
    time: endTime - startTime
  };
};