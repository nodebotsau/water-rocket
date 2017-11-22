const mqtt = require("mqtt");

const mqtt_host = "mqtt://iot.eclipse.org";
const mqtt_topic = "rocket_surgery/data";

const speed = 2000;

const start_time = Date.now();

let client  = mqtt.connect(mqtt_host);

client.on('connect', function () {
    console.log("Connected");
});

let intv = setInterval(() => {
    if (client.connected) {
        const payload = {
            id: "30aea4391908",
            t: Date.now() - start_time,
            acc: Math.random() * 3,
            gyr: Math.random() * 2000,
            alt: Math.random() * 200,
        }

        client.publish(mqtt_topic, JSON.stringify(payload));
        console.log(payload);
    }
}, 5000);

