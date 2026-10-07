/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SupabaseService } from 'src/Database/database.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(userData: any): Promise<any> {
    const { name, email, age, phoneNumber, goal, password } = userData;
    if (!name || !email || !age || !phoneNumber || !goal || !password) {
      throw new BadRequestException('All fields are required');
    }

    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      this.logger.error('Password hashing error', hashError);
      throw new InternalServerErrorException('Error processing password');
    }

    try {
      const { data: existingUser, error: existingUserError } =
        await this.supabaseService
          .getClient()
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

      // PGRST116 means there is no account with this email yet.
      if (existingUserError && existingUserError.code !== 'PGRST116') {
        this.logger.error('Database query error', existingUserError);
        throw new ServiceUnavailableException('Signup is unavailable while the user database cannot be reached');
      }
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const { error: newUserError } = await this.supabaseService
        .getClient()
        .from('users')
        .insert([{ name, email, age, phoneNumber, goal, password: hashedPassword }]);

      if (newUserError) {
        this.logger.error('Error creating user', newUserError);
        throw new ServiceUnavailableException('Signup is unavailable while the user database cannot be reached');
      }

      return { statusCode: 201, message: 'Signup successful' };
    } catch (dbError) {
      if (dbError instanceof HttpException) {
        throw dbError;
      }
      this.logger.error('Database operation error', dbError);
      throw new ServiceUnavailableException('Signup is unavailable while the user database cannot be reached');
    }
  }

  async login(userData: any): Promise<any> {
    const { email, password } = userData;
    try {
      // Validate user data
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      // Check if user exists
      const { data: user, error: userError } = await this.supabaseService
        .getClient()
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        this.logger.error('Database query error', userError);
        throw new InternalServerErrorException(
          'Error checking user information',
        );
      }

      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }
      const payload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      // Store refresh token in the database
      const supabase = this.supabaseService.getClient();
      await supabase.from('refresh_tokens').insert({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        statusCode: 200,
        message: 'Login successful',
        userId: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      // If it's already one of our HTTP exceptions, just rethrow it
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      // For any unexpected errors
      this.logger.error('Login error', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const supabase = this.supabaseService.getClient();

    // Check if the refresh token exists and is valid
    const { data: tokenData, error } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .single();

    if (error || !tokenData || new Date(tokenData.expiresAt) < new Date()) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    // if (this.isTokenInvalidated(refreshToken)) {
    //   throw new BadRequestException('Refresh token has been invalidated');
    // }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' }
      );
      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '7d' }
      );
      await supabase
        .from('refresh_tokens')
        .update({ token: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
        .eq('id', tokenData.id);
      return newAccessToken;
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  private readonly refreshTokens: Set<string> = new Set(); // Temporary in-memory storage for invalidated tokens

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('refresh_tokens')
      .delete()
      .eq('token', refreshToken);

    if (error) {
      this.logger.error('Error deleting refresh token', error);
      throw new InternalServerErrorException('Failed to log out');
    }
  }

  isTokenInvalidated(refreshToken: string): boolean {
    return this.refreshTokens.has(refreshToken);
  }
}
