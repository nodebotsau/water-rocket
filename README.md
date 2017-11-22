# Water Rocket: ESP32 in a bottle !

Node + uPython Water Rockets with ESP32s and ground base telemetry system

## Installation

```
  git clone git@github.com:nodebotsau/water-rocket.git
  cd water-rocket
  npm install  # this will at libzmq ... don't worry about it !
  cd rocket-pakage
  cp settings.template settings.py
  vi settings.py
    WIFI_SSID     = "YOUR_WIFI_SSID"
    WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
    MQTT_HOST     = "iot.eclipse.org"
    MQTT_TOPIC    = "YOUR_NAME/rocket"
```
