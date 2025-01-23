import { Buffer } from "buffer";

const subtleCrypto = window.crypto.subtle; // Access the SubtleCrypto API

// Error handling function for cryptographic operations
const handleCryptoError = (error : Error) => {
  console.error("Cryptographic operation error:", error); 
  console.error("Error message:", error.message); 
  console.error("Error name:", error.name); 
  throw new Error('Encryption or decryption failed'); // Re-throw for caller handling
};

const secretKey = await import.meta.env.VITE_ENC_KEY
console.log("Secret key check",secretKey);
console.log("secretKey length:", secretKey.length); 


export const encryptRefreshToken = async (refreshToken: any) => {
  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  console.log("iv check", iv)

  // Import the encryption key (assuming it's securely obtained from the server)
  const importedKey = await subtleCrypto.importKey(
    'raw', // Key format
    new TextEncoder().encode(secretKey), // Replace with actual key
    { name: 'AES-CBC', length: 128 }, // Algorithm and key length
    false, // Not extractable (prevents exporting the key)
    ['encrypt'] // Allowed usage
  ).catch(handleCryptoError);

  if (importedKey) { 
    console.log("importedKey algorithm:", importedKey.algorithm);
    console.log("importedKey usage:", importedKey.usages);
    console.log("importedKey extractable:", importedKey.extractable);
  } else {
    console.error("Error importing key.");
  }

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

export const decryptRefreshToken = async (encryptedData: string) => {
  // Extract the IV from the stored encrypted data
  const [ivBase64, encryptedDataBase64] = encryptedData.split(':');
  const iv = Buffer.from(ivBase64, 'base64');

  // Import the encryption key (assuming it's securely obtained from the server)
  const importedKey = await subtleCrypto.importKey(
    'raw', // Key format
    new TextEncoder().encode(import.meta.env.VITE_ENC_KEY), // Replace with actual key
    { name: 'AES-CBC', length: 256 }, // Algorithm and key length
    false, // Not extractable (prevents exporting the key)
    ['decrypt'] // Allowed usage
  ).catch(handleCryptoError);

  // Decrypt the refresh token
  const decryptedData = await subtleCrypto.decrypt(
    { name: 'AES-CBC', iv: iv },
    importedKey,
    Buffer.from(encryptedDataBase64, 'base64')
  ).catch(handleCryptoError);

  return new TextDecoder().decode(decryptedData);
};