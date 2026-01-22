import * as bcrypt from 'bcrypt';

export class HashService {
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Lỗi khi mã hóa password: ' + error.message);
    }
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Lỗi khi so sánh password: ' + error.message);
    }
  }
}
