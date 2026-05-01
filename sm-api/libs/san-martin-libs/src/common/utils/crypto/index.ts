import * as crypto from 'crypto';

const CRYPTO_SALT = process.env.CRYPTO_SALT;

if (!CRYPTO_SALT) {
  throw new Error('CRYPTO_SALT environment variable is required for secure password hashing');
}
const keyLength = 64;

const generateVerificationCode = (length: number = 6): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += crypto.randomInt(0, 10).toString();
  }
  return code;
};

const hashString = async (code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Use consistent salt for reproducible hashes
    const salt = Buffer.from(CRYPTO_SALT, 'utf8');
    
    // Use scrypt for key derivation (similar to bcrypt)
    crypto.scrypt(code, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      
      // Check if derivedKey is null before converting to string
      if (!derivedKey) {
        reject(new Error('Failed to derive key'));
        return;
      }
      
      // Return only the derived key (no need to store salt since it's consistent)
      resolve(derivedKey.toString('hex'));
    });
  });
};

const compareString = async (code: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate hash format
      if (!hash || typeof hash !== 'string') {
        reject(new Error('Invalid hash format'));
        return;
      }

      // Validate hash length (should be 128 characters for 64 bytes in hex)
      if (hash.length !== 128) {
        reject(new Error('Invalid hash length'));
        return;
      }

      // Use consistent salt for comparison
      const salt = Buffer.from(CRYPTO_SALT, 'utf8');
      
      // Hash the input with the same salt
      crypto.scrypt(code, salt, keyLength, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Compare with stored hash
        try {
          const storedHash = Buffer.from(hash, 'hex');
          const match = crypto.timingSafeEqual(derivedKey, storedHash);
          resolve(match);
        } catch (timingError) {
          reject(new Error('Hash comparison failed'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const generatePassword = () => {
  const length = 12;
  const charset =
    '@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < length; ++i) {
    password += charset.charAt(crypto.randomInt(0, charset.length));
  }
  return password;
};

const encryptData = (
  body: Record<string, unknown>,
  cryptographyInfo: { key: string; iv: string },
) => {
  const key = Buffer.from(cryptographyInfo.key, 'hex');
  const iv = Buffer.from(cryptographyInfo.iv, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export { generateVerificationCode, hashString, compareString, encryptData };
