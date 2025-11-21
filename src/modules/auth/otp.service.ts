import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * OTP Service - Wrapper for third-party OTP providers
 * Supports: Twilio, AWS SNS, or any SMS provider
 *
 * Configure via environment variables:
 * OTP_PROVIDER=twilio|aws|custom
 * OTP_API_KEY=your_api_key
 * OTP_API_SECRET=your_api_secret
 * OTP_FROM_NUMBER=your_sender_number
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly provider: string;

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>('OTP_PROVIDER', 'mock');
  }

  /**
   * Send OTP to mobile number via third-party service
   * @param mobile - Mobile number in international format
   * @returns Promise with success status and message
   */
  async sendOtp(mobile: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Sending OTP to ${mobile} via ${this.provider}`);

    try {
      switch (this.provider) {
        case 'twilio':
          return await this.sendViaTwilio(mobile);
        case 'aws':
          return await this.sendViaAWS(mobile);
        case 'mock':
          return await this.sendViaMock(mobile);
        default:
          throw new Error(`Unsupported OTP provider: ${this.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${mobile}:`, error.message);
      throw error;
    }
  }

  /**
   * Verify OTP via third-party service
   * @param mobile - Mobile number
   * @param otp - OTP code to verify
   * @returns Promise with verification status
   */
  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Verifying OTP for ${mobile} via ${this.provider}`);

    try {
      switch (this.provider) {
        case 'twilio':
          return await this.verifyViaTwilio(mobile, otp);
        case 'aws':
          return await this.verifyViaAWS(mobile, otp);
        case 'mock':
          return await this.verifyViaMock(mobile, otp);
        default:
          throw new Error(`Unsupported OTP provider: ${this.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to verify OTP for ${mobile}:`, error.message);
      throw error;
    }
  }

  /**
   * Twilio SMS implementation
   * Requires: npm install twilio
   */
  private async sendViaTwilio(_mobile: string): Promise<{ success: boolean; message: string }> {
    // Example implementation - uncomment when twilio is installed
    /*
    const twilio = require('twilio');
    const client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );

    const verification = await client.verify.v2
      .services(this.configService.get('TWILIO_VERIFY_SERVICE_SID'))
      .verifications.create({ to: mobile, channel: 'sms' });

    return {
      success: verification.status === 'pending',
      message: 'OTP sent successfully'
    };
    */

    throw new Error('Twilio integration not configured. Please install and configure Twilio.');
  }

  private async verifyViaTwilio(
    _mobile: string,
    _otp: string,
  ): Promise<{ success: boolean; message: string }> {
    // Example implementation
    /*
    const twilio = require('twilio');
    const client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN')
    );

    const verificationCheck = await client.verify.v2
      .services(this.configService.get('TWILIO_VERIFY_SERVICE_SID'))
      .verificationChecks.create({ to: mobile, code: otp });

    return {
      success: verificationCheck.status === 'approved',
      message: verificationCheck.status === 'approved' ? 'OTP verified successfully' : 'Invalid OTP'
    };
    */

    throw new Error('Twilio integration not configured');
  }

  /**
   * AWS SNS implementation
   * Requires: npm install @aws-sdk/client-sns
   */
  private async sendViaAWS(_mobile: string): Promise<{ success: boolean; message: string }> {
    // Example implementation - uncomment when AWS SDK is installed
    /*
    const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
    
    const snsClient = new SNSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const params = {
      Message: `Your verification code is: ${otp}. Valid for 10 minutes.`,
      PhoneNumber: mobile,
    };

    await snsClient.send(new PublishCommand(params));
    
    // Store OTP in cache/redis with expiry
    
    return {
      success: true,
      message: 'OTP sent successfully'
    };
    */

    throw new Error('AWS SNS integration not configured. Please install and configure AWS SDK.');
  }

  private async verifyViaAWS(
    _mobile: string,
    _otp: string,
  ): Promise<{ success: boolean; message: string }> {
    // Verify against cached OTP
    throw new Error('AWS SNS verification not configured');
  }

  /**
   * Mock implementation for development/testing
   * Always sends OTP: 123456
   */
  private async sendViaMock(mobile: string): Promise<{ success: boolean; message: string }> {
    this.logger.warn(`MOCK MODE: OTP for ${mobile} is: 123456`);

    return {
      success: true,
      message: 'OTP sent successfully (MOCK MODE - use 123456)',
    };
  }

  private async verifyViaMock(
    mobile: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    const isValid = otp === '123456';

    this.logger.warn(
      `MOCK MODE: Verifying OTP ${otp} for ${mobile} - ${isValid ? 'SUCCESS' : 'FAILED'}`,
    );

    return {
      success: isValid,
      message: isValid ? 'OTP verified successfully' : 'Invalid OTP',
    };
  }
}
