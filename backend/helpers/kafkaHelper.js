const { Kafka } = require('kafkajs');
const { KAFKA_TOPICS } = require('../config/constants');

const kafka = new Kafka({
    clientId: 'my-producer',
    brokers: [process.env.KAFKA_URL]
});

const producer = kafka.producer();

exports.produceMessages = async (messages) => {
    await producer.connect();
    console.log('Producer connected');
    if (messages.notice?.size > 0) {
        await producer.send({
            topic: KAFKA_TOPICS.notice,
            messages: messages.notice
        });
    }

    if (messages.reminder?.size > 0) {
        await producer.send({
            topic: KAFKA_TOPICS.reminder,
            messages: messages.reminder
        });
    }

    if (messages.result?.size > 0) {
        await producer.send({
            topic: KAFKA_TOPICS.result,
            messages: messages.result
        });
    }

    console.log('Messages sent');
    await producer.disconnect();
};

exports.processQueryResponse = async (studentIds, title, description) => {
    await producer.connect();
    console.log('Producer connected');

    const data = {
        studentIds,
        title,
        description
    };

    await producer.send({
        topic: KAFKA_TOPICS.query_response,
        messages: [
            {
                key: null,
                value: JSON.stringify(data)
            }
        ]
    });

    console.log('Messages sent');
    await producer.disconnect();
};
