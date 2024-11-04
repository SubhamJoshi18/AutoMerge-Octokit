import type { Channel, ConsumeMessage } from 'amqplib';
import { setup_config } from '../../config/queueConfig.js';
import gitLogger from '../../libs/logger.js';

class RabbitMqConsumer {
  private channel: Promise<Channel>;
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
    this.channel = setup_config(queueName, queueExchange, queueRoutingKey);
  }

  public async consumeMessage(
    callback: (msg: ConsumeMessage | null) => Promise<void>
  ) {
    try {
      const channel = await this.channel;

      await channel.consume(this.queueName, async (msg) => {
        if (msg) {
          console.log(msg.content.toString());
          try {
            await callback(msg);

            channel.ack(msg);
          } catch (processError) {
            gitLogger.error(
              `Error processing message from ${this.queueName}: ${processError}`
            );
          }
        }
      });

      gitLogger.info(`Consumer is waiting for messages in ${this.queueName}`);
    } catch (err) {
      gitLogger.error(
        `Error consuming messages from ${this.queueName}: ${err}`
      );
    }
  }
}

export default RabbitMqConsumer;
