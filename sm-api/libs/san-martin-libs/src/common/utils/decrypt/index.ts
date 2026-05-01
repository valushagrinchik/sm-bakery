import * as crypto from 'crypto';

export const decrypt = (token: string, cryptographyInfo: { key: string; iv: string }) => {
  const key = Buffer.from(new String(cryptographyInfo.key), 'hex');
  const iv = Buffer.from(new String(cryptographyInfo.iv), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
};
