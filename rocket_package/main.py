from settings import *

import network
import time
import struct
import machine
from umqtt.robust import MQTTClient
import bmp280
import mpu9250
import gc

pwr = machine.Pin(22, machine.Pin.OUT)
pwr(0)

wlan = network.WLAN()
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASSWORD)
while not wlan.isconnected(): 
    time.sleep(0.5)

name = ("%02x" * 6) % struct.unpack("6B", machine.unique_id())
topic = "%s/%s" % (MQTT_TOPIC, name)

mqtt = MQTTClient(name, MQTT_HOST)
mqtt.connect()

i2c = machine.I2C(freq=400000,scl=machine.Pin(19),sda=machine.Pin(23))
i2c.writeto_mem(104,107,bytes([0]))

bmp = bmp280.BMP280(i2c)
mpu = mpu9250.MPU9250(i2c)

queue = []

time.sleep(1)

_, _, alt0 = bmp.read()
t0 = time.ticks_ms()

def read_sensors(_):
    if gc.mem_free() > 4096:
        (acc_x, acc_y, acc_z), _ = mpu.read()
        _, _, alt = bmp.read()
        t = time.ticks_ms()
        queue.insert(0, [t - t0, acc_z, alt - alt0])

timer = machine.Timer(0)
timer.init(period=TIMER_PERIOD, mode=machine.Timer.PERIODIC, callback=read_sensors)

while True:
    try:
        t, acc_z, alt = queue.pop()
        msg = '{"id":"%s","t":%d,"acc":%f,"alt":%f}' % (name, t, acc_z, alt)
        mqtt.publish(topic, msg)
    except IndexError:
        time.sleep(TIMER_PERIOD*0.0015)
    gc.collect()
