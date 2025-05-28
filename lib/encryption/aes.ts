import CryptoJS from 'crypto-js';

export const aesEncrypt = (message: string, secretKey: string): { ciphertext: string, time: number } => {
  const startTime = performance.now();
  const encrypted = CryptoJS.AES.encrypt(message, secretKey).toString();
  const endTime = performance.now();
  
  return {
    ciphertext: encrypted,
    time: endTime - startTime
  };
};

export const aesDecrypt = (ciphertext: string, secretKey: string): { plaintext: string, time: number } => {
  const startTime = performance.now();
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  const endTime = performance.now();
  
  return {
    plaintext,
    time: endTime - startTime
  };
};