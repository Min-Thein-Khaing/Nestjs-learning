import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeMail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'Support Team <support@blog.com>',
      subject: 'Welcome to NBlog',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
      },
    });
  }
}
