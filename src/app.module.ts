import { Module } from "@nestjs/common";
import { EventsModule } from "./events/events.module";
import { MailerModule, HandlebarsAdapter } from "@nest-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import "dotenv/config";
import { join } from "path";
import { MailModule } from "./mail/mail.module";
import { KafkaModule } from "./kafka/kafka.module";

@Module({
  imports: [
    EventsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: process.env.MAIL_HOST,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },

        defaults: {
          from: `"No Reply" <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, "src/templates/email"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    KafkaModule,
  ],
})
export class AppModule {}
