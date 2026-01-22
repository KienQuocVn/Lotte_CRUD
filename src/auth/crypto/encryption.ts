import * as crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  private key = crypto.scryptSync(
    process.env.ENCRYPTION_KEY || 'default-secret-key',
    'salt',
    32,
  );
  private iv = Buffer.alloc(16, 0);

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
}
