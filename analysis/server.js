const express = require('express')
const mqtt = require('mqtt');
const path = require('path');

const app = express();

const app_root = "analysis";

app.use(express.static('analysis/public'));

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
