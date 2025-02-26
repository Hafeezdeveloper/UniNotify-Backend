import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(
    userEmail: string,
    subject: string,
    template: string,
    data: Record<string, any>,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: subject,
      template: template,
      context: data,
    });
  }

}
