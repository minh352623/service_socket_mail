import { Injectable, Logger } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
require("dotenv").config();

@Injectable()
export class KafkaService {
  private loggerService: Logger;
  private kafkaClient: Kafka;
  private consumer: Consumer;
  private producer: Producer;
  constructor() {
    this.loggerService = new Logger();
    this.kafkaClient = new Kafka({
      clientId: "exchange-microservice",
      brokers: [process.env.HOST_KAFKA],
      sasl: {
        mechanism: process.env.MECHANISM,
        username: process.env.USERNAME_KAFKA,
        password: process.env.PASSWORD_KAFKA,
      } as any,
    });
    this.consumer = this.kafkaClient.consumer({
      groupId: "elearning-user-microservice",
    });

    this.producer = this.kafkaClient.producer();
  }

  async CheckAndCreateTopic(topic: string) {
    const admin = this.kafkaClient.admin();
    await admin.connect();
    const listTopic = await admin.listTopics();
    if (!listTopic.includes(topic)) {
      await admin.createTopics({
        topics: [{ topic: topic }],
      });
    }
    await admin.disconnect();
  }

  async SendMessage(topic: string, message: Object) {
    await this.CheckAndCreateTopic(topic);

    await this.producer.connect();
    const sended = await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await this.producer.disconnect();
    return sended;
  }

  GetConsumer(groupId: string | undefined = undefined) {
    if (groupId) {
      return this.kafkaClient.consumer({
        groupId: groupId,
      });
    }

    return this.consumer;
  }
}
