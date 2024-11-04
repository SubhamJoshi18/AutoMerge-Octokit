import amqp from 'amqplib';
import gitLogger from '../libs/logger.js';

export const setup_config = async (
  queueName: string,
  queueExchange: string,
  queueRoutingKey: string
) => {
  let connection: null | amqp.Connection = null;
  let channel: null | amqp.Channel = null;
  try {
    connection = await amqp.connect('localhost');

    channel = await connection.createChannel();

    await channel.assertExchange(queueExchange, 'direct', { durable: true });

    await channel.assertQueue(queueName, { durable: true });

    await channel.bindQueue(queueName, queueExchange, queueRoutingKey);

    return channel;
  } catch (err) {
    gitLogger.error(`Error in Configuation of the Rabbit Mq queue`);
    process.exit(1);
  }
};
