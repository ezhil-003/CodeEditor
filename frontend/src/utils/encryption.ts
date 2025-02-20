// src/utils/encryption.ts
import { Buffer } from "buffer";

const subtleCrypto = window.crypto.subtle; // Access the SubtleCrypto API

// Error handling function for cryptographic operations
const handleCryptoError = (error : Error) => {
  console.error("Cryptographic operation error:", error); 
  console.error("Error message:", error.message); 
  console.error("Error name:", error.name); 
  throw new Error('Encryption or decryption failed'); // Re-throw for caller handling
};

const secretKey = import.meta.env.VITE_ENC_KEY;
if (!secretKey) throw new Error("Encryption key is missing.");



export const encryptRefreshToken = async (refreshToken: any) => {
  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  console.log("iv check", iv)

  // Import the encryption key (assuming it's securely obtained from the server)
  const importedKey = await subtleCrypto.importKey(
    'raw', // Key format
    new TextEncoder().encode(secretKey), // Replace with actual key
    { name: 'AES-CBC', length: 256 }, // Algorithm and key length
    false, // Not extractable (prevents exporting the key)
    ['encrypt'] // Allowed usage
  ).catch(handleCryptoError);

  // Encrypt the refresh token
  const encryptedData = await subtleCrypto.encrypt(
    { name: 'AES-CBC', iv: iv },
    importedKey,
    new TextEncoder().encode(refreshToken)
  ).catch(handleCryptoError);

  // Convert the encrypted data and IV to a base64 string
  const encryptedDataBase64 = Buffer.from(encryptedData).toString('base64');
  const ivBase64 = Buffer.from(iv).toString('base64');

  return `${ivBase64}:${encryptedDataBase64}`;
};

export const decryptRefreshToken = async (encryptedData: any) => {
  // Extract the IV from the stored encrypted data
  const [ivBase64, encryptedDataBase64] = encryptedData.split(':');
  const iv = new Uint8Array(Buffer.from(ivBase64, 'base64'));

  // Import the encryption key
  const key = import.meta.env.VITE_ENC_KEY;
  if (!key) {
    console.error("decryptRefreshToken: Encryption key is missing.");
    throw new Error("Encryption key is undefined.");
  }

  // Import the encryption key (assuming it's securely obtained from the server)
  const importedKey = await subtleCrypto.importKey(
    'raw', // Key format
    new TextEncoder().encode(key), // Replace with actual key
    { name: 'AES-CBC', length: 256 }, // Algorithm and key length
    false, // Not extractable (prevents exporting the key)
    ['decrypt'] // Allowed usage
  ).catch(handleCryptoError);

  // Decrypt the refresh token
  const decryptedData = await subtleCrypto.decrypt(
    { name: 'AES-CBC', iv },
    importedKey,
    Buffer.from(encryptedDataBase64, 'base64')
  ).catch(handleCryptoError);

  return new TextDecoder().decode(decryptedData);
};