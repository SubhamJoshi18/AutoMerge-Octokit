import { setup_config } from '../../config/queueConfig.js';
import gitLogger from '../../libs/logger.js';
import type, { Channel } from 'amqplib';

class RabbitMqProducer {
  public queue: Promise<type.Channel>;
  private queueName: string;
  private queueExchange: string;
  private queueRoutingKey: string;

  constructor(
    queueName: string,
    queueExchange: string,
    queueRoutingKey: string
  ) {
    this.queueName = queueName;
    this.queueExchange = queueExchange;
    this.queueRoutingKey = queueRoutingKey;
    this.queue = setup_config(queueName, queueExchange, queueRoutingKey);
  }

  public async send_to_queue(content: any) {
    try {
      (await this.queue).publish(
        this.queueExchange,
        this.queueRoutingKey,
        Buffer.from(JSON.stringify(content))
      );
      gitLogger.info(`Send the content to the ${this.queueName}`);
    } catch (err) {
      gitLogger.error(`An Error sending to the Queue : ${this.queueName}`);
      process.exit(1);
    }
  }
}

export default RabbitMqProducer;
