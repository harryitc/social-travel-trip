import { UserService } from '@modules/user/user.service';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  // Store reset tokens temporarily (in a real app, this would be in a database)
  private resetTokens: Map<string, { email: string; expires: Date }> =
    new Map();

  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Validate user credentials
   * @param username Username
   * @param password Password
   * @returns User object if valid
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        'User không tồn tại hoặc mật khẩu không đúng',
      );
    }
    return user;
  }

  /**
   * Login user and generate JWT token
   * @param username Username
   * @param password Password
   * @returns JWT token
   */
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = { sub: user.user_id };
    const token = this.jwt.sign(payload);
    return { access_token: token };
  }

  /**
   * Register a new user
   * @param username Username
   * @param password Password
   * @param full_name Full name (optional)
   * @param email Email (optional)
   * @returns Created user
   */
  async register(
    username: string,
    password: string,
    full_name?: string,
    email?: string,
  ) {
    return this.userService.create({
      username,
      password,
      full_name,
      email,
    });
  }

  /**
   * Request password reset
   * @param email User email
   * @returns Success message
   */
  async resetPassword(email: string) {
    // In a real app, you would check if the email exists in the database
    // For demo purposes, we'll just generate a token

    // Generate a random token
    const token = randomBytes(32).toString('hex');

    // Set expiration to 1 hour from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Store the token
    this.resetTokens.set(token, { email, expires });

    // In a real app, you would send an email with the reset link
    // For demo purposes, we'll just return the token
    console.log(`Reset token for ${email}: ${token}`);

    return {
      message:
        'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.',
      // Include token in response for demo purposes
      // In a real app, you would NOT include this
      token,
    };
  }

  /**
   * Confirm password reset with token
   * @param token Reset token
   * @param password New password
   * @returns Success message
   */
  async confirmResetPassword(token: string, password: string) {
    // Check if token exists and is valid
    const resetData = this.resetTokens.get(token);

    if (!resetData) {
      throw new NotFoundException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Check if token has expired
    if (resetData.expires < new Date()) {
      this.resetTokens.delete(token);
      throw new BadRequestException('Token đã hết hạn');
    }

    // In a real app, you would find the user by email and update their password
    // For demo purposes, we'll just log the action
    console.log(`Password reset for ${resetData.email}`);

    // Remove the used token
    this.resetTokens.delete(token);

    return { message: 'Mật khẩu đã được đặt lại thành công' };
  }
}
