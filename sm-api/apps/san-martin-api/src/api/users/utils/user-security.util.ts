import { Injectable } from '@nestjs/common';
import { 
  generatePassword, 
  generateVerificationCode, 
  hashString, 
  compareString,
  minutesToSeconds,
  ttlSmsCodeMinutes,
} from '@san-martin/san-martin-libs';
import { RedisService } from '@san-martin/san-martin-libs';

@Injectable()
export class UserSecurityUtil {
  
  constructor(private readonly redisService: RedisService) {}

  /**
   * Generates and stores SMS verification code
   */
  async generateAndStoreSmsCode(userId: number): Promise<string> {
    const smsCode = generateVerificationCode();
    const hashedSmsCode = await hashString(smsCode);
    
    await this.redisService.setSmsCode(
      userId, 
      hashedSmsCode, 
      minutesToSeconds(ttlSmsCodeMinutes)
    );
    
    return smsCode;
  }

  /**
   * Generates and stores reset password code
   */
  async generateAndStoreResetPasswordCode(userId: number): Promise<string> {
    const resetCode = generateVerificationCode();
    const hashedResetCode = await hashString(resetCode);
    
    await this.redisService.setResetPasswordCode(userId, hashedResetCode);
    
    return resetCode;
  }

  /**
   * Verifies SMS code for user
   */
  async verifySmsCode(userId: number, providedCode: string): Promise<boolean> {
    const storedCode = await this.redisService.getSmsCode(userId);
    return await compareString(providedCode, storedCode);
  }

  /**
   * Verifies reset password code for user
   */
  async verifyResetPasswordCode(userId: number, providedCode: string): Promise<boolean> {
    const storedCode = await this.redisService.getResetPasswordCode(userId);
    return await compareString(providedCode, storedCode);
  }

  /**
   * Clears SMS code for user
   */
  async clearSmsCode(userId: number): Promise<void> {
    await this.redisService.delSmsCode(userId);
  }

  /**
   * Clears reset password code for user
   */
  async clearResetPasswordCode(userId: number): Promise<void> {
    await this.redisService.delResetPasswordCode(userId);
  }

  /**
   * Generates secure password and returns both plain and hashed versions
   */
  async generateSecurePassword(): Promise<{ plain: string; hashed: string }> {
    const plainPassword = generatePassword();
    const hashedPassword = await hashString(plainPassword);
    
    return { plain: plainPassword, hashed: hashedPassword };
  }

  /**
   * Hashes user password
   */
  async hashPassword(password: string): Promise<string> {
    return await hashString(password);
  }

  /**
   * Stores temporary phone change verification
   */
  async storePhoneChangeVerification(userId: number, phoneNumber: string, code: string): Promise<void> {
    await this.redisService.set(`${userId}-${phoneNumber}`, code);
  }

  /**
   * Verifies phone change verification
   */
  async verifyPhoneChangeVerification(userId: number, phoneNumber: string): Promise<string | null> {
    const result = await this.redisService.get(`${userId}-${phoneNumber}`);
    return result as string | null;
  }

  /**
   * Clears phone change verification
   */
  async clearPhoneChangeVerification(userId: number, phoneNumber: string): Promise<void> {
    await this.redisService.del(`${userId}-${phoneNumber}`);
  }
}
