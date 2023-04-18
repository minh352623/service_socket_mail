import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nest-modules/mailer";
import { KafkaService } from "src/kafka/kafka.service";

@Injectable()
export class MailService {
  private loggerService: Logger;

  constructor(
    private mailerService: MailerService,
    private readonly kafkaService: KafkaService
  ) {
    this.loggerService = new Logger();
  }

  async onModuleInit() {
    try {
      const consumerMail = this.kafkaService.GetConsumer("mail-microservice");

      // ----------------- listening on topic update exchange qoc --------------- //
      await consumerMail.connect();
      await consumerMail.subscribe({
        topic: "forgot-password",
        fromBeginning: true,
      });
      await consumerMail.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            this.loggerService.log("subscribe forgor password topic: " + topic);
            console.log(JSON.parse(message.value as any));
            // const time1 = new Date();
            // const data = await this.mailerService.sendMail({
            //   to: createSubscriber.email,
            //   subject: 'Welcome to my website',
            //   template: './welcome',
            //   context: {
            //     name: createSubscriber.name,
            //   },
            // });
            // const time2 = new Date();
            // console.log('Send Success: ', time2.getTime() - time1.getTime(), 'ms');
            // const request: {
            //   numOfQoc: number;
            //   usdt: number;
            //   id: number;
            //   exchangeId: number;
            //   status: string;
            //   uid: string;
            //   type: string;
            //   step_count: number;
            //   steps: string[];
            // } = JSON.parse(message.value as any);

            // const exchange = await this.databaseService.exchange.findUnique({
            //   where: {
            //     id: Number(request.exchangeId),
            //   },
            // });

            // if (exchange.quantity_exchange < request.numOfQoc) {
            //   // rollback
            //   // update status transaction
            //   return;
            // }

            // // update qoc of vendor exchange
            // exchange.quantity_exchange =
            //   Number(exchange.quantity_exchange) - Number(request.numOfQoc);
            // await this.databaseService.exchange.update({
            //   data: {
            //     ...exchange,
            //   },
            //   where: {
            //     id: exchange.id,
            //   },
            // });

            // const newTopic = request.steps[request.step_count];
            // request.step_count = Number(request.step_count) + 1;
            // await this.kafkaService.SendMessage(newTopic, {
            //   ...request,
            //   qoc: request.numOfQoc,
            //   exchangeUid: exchange.uid,
            //   type: 'add',
            //   status: 'updated exchange qoc',
            // });
          } catch (err) {
            this.loggerService.error(
              "An error while handle the message update qoc",
              err
            );
          }
        },
      });
    } catch (err) {
      this.loggerService.error("An error while init the module exchange", err);
    }
  }
}
