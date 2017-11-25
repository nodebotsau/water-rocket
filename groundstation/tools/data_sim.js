let program = require("commander");
const mqtt = require("mqtt");

program
    .version("0.1.0")
    .option("-f, --freq <n>", "ms between messages", parseInt)
    .option("-h, --host [value]", "Hostname for MQTT server")
    .option("-p, --proto [value]", "Protocol [type mqtt, mqtts, http, https]")
    .option("-t, --topic [value]", "Topic to publish to")
    .parse(process.argv)


const mqtt_host = program.host || "iot.eclipse.org";
const mqtt_protocol = program.proto || "mqtt";
const mqtt_topic = program.topic || "rocket_surgery/data";

const speed = program.freq || 300;

console.log(mqtt_host, mqtt_protocol, mqtt_topic, speed);

const start_time = Date.now();

let client  = mqtt.connect(mqtt_protocol + "://" + mqtt_host);

client.on('connect', function () {
    console.log("Connected");
});

let intv = setInterval(() => {
    if (client.connected) {
        const payload = {
            id: "30aea4391908",
            t: Date.now() - start_time,
            acc: (Math.random() * 6) - 3,
            //gyr: Math.random() * 2000,
            alt: (Math.random() * 10) + 30,
        }

        client.publish(mqtt_topic, JSON.stringify(payload));
        console.log(payload);
    }
}, speed);

