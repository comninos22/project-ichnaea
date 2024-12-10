// src/main.ts
import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

const RABBITMQ_URL = 'amqp://localhost';
const INPUT_QUEUE = 'file.events';
const OUTPUT_EXCHANGE = 'file.exchange';

async function startTrackingService() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Ensure the input queue exists
    await channel.assertQueue(INPUT_QUEUE, { durable: true });

    // Ensure the exchange exists
    await channel.assertExchange(OUTPUT_EXCHANGE, 'topic', { durable: true });

    console.log(`Tracking Service started. Waiting for messages in queue: ${INPUT_QUEUE}`);

    // Consume messages from the input queue
    channel.consume(INPUT_QUEUE, async (msg) => {
      if (!msg) return;

      try {
        // Parse the incoming message
        const event = JSON.parse(msg.content.toString());
        console.log('Received event:', event);

        // Process the event (e.g., log or track file changes)
        const processedEvent = processFileEvent(event);

        // Publish the processed event to the exchange
        channel.publish(
          OUTPUT_EXCHANGE,
          'file.processed',
          Buffer.from(JSON.stringify(processedEvent)),
          { persistent: true }
        );

        console.log('Published processed event to exchange:', processedEvent);

        // Acknowledge the message
        channel.ack(msg);
      } catch (err) {
        console.error('Error processing message:', err);
        channel.nack(msg, false, false); // Discard message on error
      }
    });
  } catch (error) {
    console.error('Error starting Tracking Service:', error);
    process.exit(1);
  }
}

/**
 * Process the incoming file event and add tracking metadata.
 * @param event The raw event from the queue.
 * @returns Processed event with tracking metadata.
 */
function processFileEvent(event: any) {
  const { fileId, fileName, action } = event;

  if (!fileId || !fileName || !action) {
    throw new Error('Invalid event format: Missing required fields');
  }

  return {
    id: uuidv4(),
    fileId,
    fileName,
    action,
    timestamp: new Date().toISOString(),
  };
}

startTrackingService();
