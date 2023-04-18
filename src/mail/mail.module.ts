import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
  imports: [KafkaModule],
  providers: [MailService],
})
export class MailModule {}
