import * as crypto from 'crypto';

import * as bcrypt from 'bcrypt';

const saltRounds = 10;

const generateVerificationCode = (length: number = 6): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

const hashString = async (code: string): Promise<string> => {
  return await bcrypt.hash(code, saltRounds);
};

const compareString = async (code: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(code, hash);
};

export const generatePassword = () => {
  const length = 12;
  const charset =
    '@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (var i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

const encryptData = (
  body: Record<string, unknown>,
  cryptographyInfo: { key: string; iv: string },
) => {
  const key = Buffer.from(new String(cryptographyInfo.key), 'hex');
  const iv = Buffer.from(new String(cryptographyInfo.iv), 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export { generateVerificationCode, hashString, compareString, encryptData };
