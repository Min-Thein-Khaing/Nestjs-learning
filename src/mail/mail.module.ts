import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('appConfig.mailHost'),
          secure: configService.get<number>('appConfig.mailPort') === 465,
          port: configService.get<number>('appConfig.mailPort'),
          auth: {
            user: configService.get<string>('appConfig.smtpUserName'),
            pass: configService.get<string>('appConfig.smtpPassword'),
          },
        },
        defaults: {
          from: 'NBlog <no-reply@nblog.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(undefined, {
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
})
export class MailModule {}
