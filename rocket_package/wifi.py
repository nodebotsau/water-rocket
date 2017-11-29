import network
import time

# Parameter(s)
#   ssids: List of tuples, each one containing the Wi-Fi AP SSID and password
#
# Returns boolean: Wi-Fi connected flag

def connect(ssids):
  sta_if = network.WLAN(network.STA_IF)
  sta_if.active(True)
  aps = sta_if.scan()

  for ap in aps:
    for ssid in ssids:
      if ssid[0].encode() in ap:
        print("Connecting to " + ssid[0])
        sta_if.connect(ssid[0], ssid[1])
        print("Waiting for Wi-Fi")
        while sta_if.isconnected() == False: time.sleep(0.1)
        print("Connected to Wi-Fi")
        break  # inner loop
    if sta_if.isconnected(): break  # outer loop

  return sta_if.isconnected()
