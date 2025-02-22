require('dotenv').config({ path: '.env' });
const sequelize = require('./models/init');

const { Kafka } = require('kafkajs');
const { KAFKA_TOPICS } = require('./config/constants');
const {
    processNotice,
    processResult,
    processQueryResponse
} = require('./helpers/notificationHelper');

const kafka = new Kafka({
    clientId: 'my-consumer',
    brokers: [process.env.KAFKA_URL]
});

const consumer = kafka.consumer({ groupId: 'my-group' });

async function run() {
    try {
        await sequelize.sync({ alter: true });
        await consumer.connect();
        await consumer.subscribe({
            topics: Object.values(KAFKA_TOPICS),
            fromBeginning: false
        });

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                const value = message.value.toString();
                console.log(`Received message from ${topic}: ${value}`);

                switch (topic) {
                    case KAFKA_TOPICS.notice:
                        await processNotice(value, false);
                        break;
                    case KAFKA_TOPICS.reminder:
                        await processNotice(value, true);
                        break;
                    case KAFKA_TOPICS.result:
                        await processResult(value);
                        break;
                    case KAFKA_TOPICS.query_response:
                        await processQueryResponse(value);
                        break;
                    default:
                        console.log('Unknown topic:', topic);
                }
            }
        });
    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

run().catch(console.error);
