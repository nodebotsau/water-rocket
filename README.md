# Water Rocket: ESP32 in a bottle !

Node + uPython Water Rockets with ESP32s and ground base telemetry system

## Installation

```
  git clone git@github.com:nodebotsau/water-rocket.git
  cd water-rocket
  npm install  # this may fail on libzmq ... don't worry about it !
  cd rocket-pakage
  cp settings.template settings.py
  vi settings.py
```

Edit the settings.py file with the appropriate elements you need to connect
to the wifi station and the topic you want to send messages on.

## Operation

One of the main things you want to configure is the topic you want to send on.

Given the use of public messaging services, I would suggest `rocket_surgery/nickname`

eg `rocket_surgery/ajfisher`

### Ground station sim

Ground station contains a telemetry simulator in order to test sending messages
to the analysis server

```
  cd water-rocket
  node groundstation/tools/data_sim.js
```

Options

* -h hostname of the server to connect to - use iot.eclipse.org for a public
server or localhost if you're running mosca. Can also use an IP address
* -t topic you want to publish messages to

### Analysis server

You can watch the telemetry data coming off your rocket via the analysis server.

```
  cd water-rocket
  node analysis/server.js
```

Once it is running it will tell you that it is running on http://localhost:3000
so visit that page in a browser to get it going. You can enter the hostname
of the server you want to connect to and the topic you want to subscribe to
in the boxes on the right.

If you want to shortcut that, use the `-t` and `-h` switches to start the server
and it will set your defaults so you don't need to re-enter info when you reload.

#### Data

You will get a stream of data coming through quite quickly if everything is
working. You can pause the data stream and reset it which will give you a clear
slate again and is a handy thing to do just prior to a launch.

When the data stream is paused you can also save it to a local file for review
later. This is handy after a landing. 
