Ground station receiver package.

Goes from the point of grabbing the data being broadcast to getting in into
forms that can be used for storage.

TODO:

* Server to catch the data from the rocket (script)
* Pass data to MQTT server (use Mosca as can be NPM installed or optionally
test.mosquitto.org if network available)
* Use Node Red to get data from MQTT server and put into influx DB
* Assume an influx DB service running on local host

