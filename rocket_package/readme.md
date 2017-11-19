# Rocket telemetry readme.

This folder should contain all of the code needed for getting the
telemetry data off the payload up to the point of sending it.

## Base Platform

* ESP32, eg: the LoLin32-Lite board
* MicroPython for ESP32 

## Wiring

* 3V -> 3V3
* GPIO22 -> GND
* GPIO19 -> SCL
* GPIO23 -> SDA

## Installing

* Install MicroPython onto ESP32 board
* Use mpy-sync to copy this directory on
    `cd rocket_package; mpy-sync .`
* this directory contains umqtt.simple, mpu9250 and bmp280 libraries
  which should really be pulled in some other way but that seemed like
  the easiest way to get going

## Data Format

One little JSON document per message:

`{"id": "30aea4390e10", "t": 107000, "acc": 0.993467, "gyr": 169.295587, "alt": 2.079630}`

* id is the unique ID of the device
* t is the timestamp in ms since device boot
* acc is the RMS acceleration, in 'g'
* gyr is the RMS gyrometer reading, should be in dps.
* alt is the barometric altitude, in meters


