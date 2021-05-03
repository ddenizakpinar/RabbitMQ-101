const amqp = require("amqplib");

let message = {
  description: "a big step..",
};

const data = require("./data.json");
const queueName = process.argv[2] || "jobsQueue";

const connect_rabbitmq = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach((i) => {
      message.description = i.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Message sent", i.id);
    });

    /* ======= Interval =======
    setInterval(() => {
      message.description = new Date().getTime();
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Message sent", message);
    }, 1);
    ======= Interval  =======  */
  } catch (error) {
    console.log("Error", error);
  }
};

connect_rabbitmq();
