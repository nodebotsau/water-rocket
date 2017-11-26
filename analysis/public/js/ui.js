'use strict';

// wire up the elements of the UI to various functions.

const MQTT_DEFAULT_HOST= "iot.eclipse.org/ws";
const MQTT_DEFAULT_TOPIC = "rocket_surgery/#";

const STATES = {
    WAITING: 0,
    RUNNING: 1,
    PAUSED: 2,
};

function UI(options) {

    let opts = options || {};

    this.c = {
        host: document.getElementById("hostname"),
        topic: document.getElementById("topic"),
        connect: document.getElementById("connect"),
        state: document.getElementById("state"),
        download: document.getElementById("download"),
        reset: document.getElementById("reset"),
        config: document.getElementById("config"),
        telemetry: document.getElementById("telemetry"),
        load: document.getElementById('load'),
        loader: document.getElementById('files'),
    };

    this.STATES = STATES;
    this.state = STATES.WAITING;

    this.connected = false;
    this.mqtt = {
        host: null,
        topic: null,
    };

    this.got_signal = false;

    this.reactor = opts.reactor;

    this.event_init();
}

UI.prototype.event_init = function() {
    // sets up all of the event handlers.

    this.c.connect.addEventListener("click", (e) => {
        if (! this.connected) {
            // do the connection
            this.mqtt.host = this.c.host.value || MQTT_DEFAULT_HOST;
            this.mqtt.topic = this.c.topic.value || MQTT_DEFAULT_TOPIC;

            this.reactor.dispatchEvent('connect');
            this.connected = true;
            this.c.connect.textContent = "Disconnect";
        } else {
            // disconnect the service
            this.reactor.dispatchEvent('disconnect');
            this.connected = false;
            this.c.connect.textConnect = "Disconnecting";
        }
    });

    this.c.state.addEventListener("click", (e) => {
        if (this.state == STATES.RUNNING) {
            this.set_state('pause');
        } else if (this.state == STATES.PAUSED) {
            this.set_state('running');
        }
    });

    this.c.reset.addEventListener("click", (e) => {
        this.set_state('pause');
        this.reactor.dispatchEvent("data_reset");
    });

    this.c.download.addEventListener("click", (e) => {
        // create a data object
        this.set_state('pause');
        this.reactor.dispatchEvent('data_save');
    });

    this.c.loader.addEventListener('change', (e) => {

        this.set_state('pause');
        this.reactor.dispatchEvent("data_reset");

        let files = e.target.files;

        // should only be one
        let f = files[0];
        let reader = new FileReader();

        reader.onload = (e, result) => {
            this.reactor.dispatchEvent('data_load', e.target.result);
        };

        reader.readAsText(f);

    }, false);

    this.c.load.addEventListener('click', (e) => {
        let loader_elem = document.querySelector('.loader');
        loader_elem.classList.add("visible");
    });
};

UI.prototype.set_state = function(state) {

    if (state == "running") {
        this.state = STATES.RUNNING;
        this.c.state.textContent = "Pause";
        this.c.config.classList.remove("paused", "waiting");
        this.c.config.classList.add("running");
        this.reactor.dispatchEvent('data_running');
    } else if (state == "pause") {
        this.state = STATES.PAUSED;
        this.c.state.textContent = "Resume";
        this.c.config.classList.remove("running", "waiting");
        this.c.config.classList.add("paused");
        this.reactor.dispatchEvent('data_paused');
    } else if (state == "waiting") {
        this.state = STATES.WAITING;
        this.c.state.textContent = "Waiting";
        this.c.connect.textContent = "Connect";
        this.c.config.classList.remove("running", "paused");
        this.c.config.classList.add("waiting");
    }
};

UI.prototype.set_signal = function(state) {
    // state is a bool that defines the current state of the signal
    // from the telemetry side

    this.got_signal = state;

    if (this.state != STATES.WAITING) {
        if (! this.got_signal) {
            this.c.telemetry.classList.add("los");
        } else {
            this.c.telemetry.classList.remove("los");
        }

        this.c.telemetry.classList.remove("disconnected");
    } else {
        this.c.telemetry.classList.add("disconnected");
    }
};

UI.prototype.load_complete = function() {
    // used to just switch off the load component;
    let loader_elem = document.querySelector('.loader');
    loader_elem.classList.remove('visible');
};
