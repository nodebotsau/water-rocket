'use strict';

require('dotenv').config()

const express = require('express')
const mqtt = require('mqtt');
const path = require('path');

let program = require("commander");

program
    .version("0.1.0")
    .option("-h, --host [value]", "Hostname for MQTT server")
    .option("-p, --proto [value]", "Protocol [type mqtt, mqtts, http, https]")
    .option("-t, --topic [value]", "Topic to publish to")
    .parse(process.argv);

// now work out between dotenv and parameters what we need to listen for

const mqtt_host = program.host || process.env.MQTT_HOST || "iot.eclipse.org/ws";
const mqtt_protocol = program.proto || process.env.MQTT_PROTOCOL || "ws";
const mqtt_topic = program.topic || process.env.MQTT_TOPIC || "rocket_surgery/data";

console.log('Analysis client will default connect to ws://' + mqtt_host)
console.log('Default topic will be ' + mqtt_topic);

const app = express();

const app_root = "analysis";

app.use(express.static('analysis/public'));

app.get('/vendor/mqtt_details.js', (req, res) => {
    res.send("let mqtt_details = " + JSON.stringify({
        host: mqtt_host,
        protocol: mqtt_protocol,
        topic: mqtt_topic,
    }) + ";");
});

app.get('/vendor/d3.min.js', (req, res) => {
	res.sendFile(path.join(__dirname, "../node_modules/d3/d3.min.js"));
});

app.get('/vendor/rickshaw/:fileid', (req, res) => {
    if (req.params.fileid == 'rickshaw.min.js' || req.params.fileid == 'rickshaw.min.css') {
    	res.sendFile(path.join(__dirname, "../node_modules/rickshaw/", req.params.fileid));
    }
});

app.get('/vendor/mqtt.js', (req, res) => {
	res.sendFile(path.join(__dirname, "../node_modules/mqtt/dist/mqtt.min.js"));
});

app.listen(3000, () => console.log('Application running on http://localhost:3000'));
