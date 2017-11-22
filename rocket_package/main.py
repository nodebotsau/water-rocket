from settings import *

import machine
pwr = machine.Pin(22, machine.Pin.OUT)
pwr(0)

import network
network.WLAN().active(True)
network.WLAN().connect(WIFI_SSID, WIFI_PASSWORD)

import struct
name = ("%02x" * 6) % struct.unpack("6B", machine.unique_id())

import time
time.sleep(5)

from lib.umqtt.simple import MQTTClient
mqtt = MQTTClient(name, MQTT_HOST)
mqtt.connect()

import time
import struct
import bmp280
import mpu9250

machine.Pin(22, machine.Pin.OUT)(0)

i2c = machine.I2C(freq=400000,scl=machine.Pin(19),sda=machine.Pin(23))
i2c.writeto_mem(104,107,bytes([0]))

bmp = bmp280.BMP280(i2c)
mpu = mpu9250.MPU9250(i2c)

while True:
    acc_z, gz = mpu.read()
    _, _, alt = bmp.read()
    t = time.ticks_ms()
    #msg = '{"id": "%s", "t": %d, "acc": %f, "gyr": %f, "alt": %f}' % (name, t, acc, gyr, alt)
    msg = '{"id": "%s", "t": %d, "acc": %f, "gyr": %f, "alt": %f}' % (name, t, acc_z, gz, alt)
    mqtt.publish(MQTT_TOPIC, msg)
    time.sleep(0.05)

