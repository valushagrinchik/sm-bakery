import { hashString, compareString, generatePassword } from './index';

describe('Crypto Utils', () => {
  describe('hashString', () => {
    it('should hash a string successfully', async () => {
      const password = 'testPassword123';
      const hash = await hashString(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      // Hash should be 128 characters (64 bytes) in hex
      expect(hash.length).toBe(128);
    });

    it('should generate the same hash for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashString(password);
      const hash2 = await hashString(password);
      
      expect(hash1).toBe(hash2); // Same salt = same hash
      expect(hash1.length).toBe(hash2.length); // Same length
    });

    it('should handle empty string', async () => {
      const hash = await hashString('');
      expect(hash).toBeDefined();
      expect(hash.length).toBe(128);
    });

    it('should handle special characters', async () => {
      const password = 'bH$Qr07Mn@0#';
      const hash = await hashString(password);
      expect(hash).toBeDefined();
      expect(hash.length).toBe(128);
    });
  });

  describe('compareString', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashString(password);
      const result = await compareString(password, hash);
      
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = await hashString(password);
      const result = await compareString(wrongPassword, hash);
      
      expect(result).toBe(false);
    });

    it('should return false for empty password when hash is from non-empty password', async () => {
      const password = 'testPassword123';
      const hash = await hashString(password);
      const result = await compareString('', hash);
      
      expect(result).toBe(false);
    });

    it('should handle the specific superadmin password', async () => {
      const password = 'bH$Qr07Mn@0#';
      const storedHash = '60dec7f0bbfbef2185e9efcd8e4f325d027ca0f190d24e35e89f8cbc1a92980b78461dabf89790af4dc71c431ee7a55ff3fa8524e8593725234886dff1f7a98e7d86bef24a05451c0860cbe0dbe7ad0e106a36f1b94678d7143d6546a9896cd7';
      
      const result = await compareString(password, storedHash);
      expect(result).toBe(true);
    });

    it('should reject invalid hash format', async () => {
      const password = 'testPassword123';
      const invalidHash = 'invalid_hash';
      
      await expect(compareString(password, invalidHash)).rejects.toThrow('Invalid hash format');
    });

    it('should reject hash that is too short', async () => {
      const password = 'testPassword123';
      const shortHash = '12345678';
      
      await expect(compareString(password, shortHash)).rejects.toThrow('Invalid hash length');
    });
  });

  describe('generatePassword', () => {
    it('should generate password of correct length', () => {
      const password = generatePassword();
      expect(password).toBeDefined();
      expect(password.length).toBe(12);
    });

    it('should generate different passwords each time', () => {
      const password1 = generatePassword();
      const password2 = generatePassword();
      
      expect(password1).not.toBe(password2);
      expect(password1.length).toBe(password2.length);
    });

    it('should contain allowed characters only', () => {
      const password = generatePassword();
      const allowedChars = '@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      
      for (const char of password) {
        expect(allowedChars).toContain(char);
      }
    });

    it('should contain mix of character types', () => {
      const password = generatePassword();
      const hasSpecial = /[@#$&*]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      
      // Should have at least some variety (not all requirements, but good mix)
      const varietyCount = [hasSpecial, hasNumber, hasUpper, hasLower].filter(Boolean).length;
      expect(varietyCount).toBeGreaterThan(1);
    });
  });

  describe('Integration Tests', () => {
    it('should work end-to-end: generate -> hash -> compare', async () => {
      const password = generatePassword();
      const hash = await hashString(password);
      const isMatch = await compareString(password, hash);
      
      expect(isMatch).toBe(true);
    });

    it('should handle multiple passwords correctly', async () => {
      const passwords = ['password1', 'bH$Qr07Mn@0#', 'test123!@#', ''];
      const hashes = await Promise.all(passwords.map(p => hashString(p)));
      
      for (let i = 0; i < passwords.length; i++) {
        const isMatch = await compareString(passwords[i], hashes[i]);
        expect(isMatch).toBe(true);
        
        // Should not match other passwords
        for (let j = 0; j < passwords.length; j++) {
          if (i !== j) {
            const isWrongMatch = await compareString(passwords[j], hashes[i]);
            expect(isWrongMatch).toBe(false);
          }
        }
      }
    });
  });
});
