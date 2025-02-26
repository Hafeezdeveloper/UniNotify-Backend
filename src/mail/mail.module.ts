import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {MailService} from './mail.service';
import {join} from 'path';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL'),
            pass: configService.get<string>('PASS_KEY'),
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL'),
        },
        template: {
          dir: join(
            __dirname,
            '../../src/mail/templates',
            // configService.get<string>('ENVIRONMENT') === 'development'
            //   ? '../../src/mail/templates'
            //   : '../../src/mail/templates',
          ),
          adapter: new HandlebarsAdapter(),
          options: {strict: true},
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
