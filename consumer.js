const amqp = require("amqplib");

const queueName = process.argv[2] || "jobsQueue";
const data = require("./data.json");

const connect_rabbitmq = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    console.log("Waiting for message...");

    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((u) => u.id == messageInfo.description);

      if (userInfo) {
        console.log("Processed", userInfo);
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log("Error", error);
  }
};

connect_rabbitmq();
