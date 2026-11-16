import time
from machine import Pin
import dht
# --- CONFIGURATION ---
SENSOR_PIN = 4 # DHT22 Data Pin
LED_PIN = 2 # Onboard Status LED (Blue LED)
INTERVAL = 2 # Reading interval (seconds)
# --- SETUP ---
sensor = dht.DHT22(Pin(SENSOR_PIN))
led = Pin(LED_PIN, Pin.OUT)
# --- MAIN LOOP ---
while True:
try:
# 1. Blink LED (Visual Feedback)
led.value(1)
# 2. Read Sensor
sensor.measure()
t = sensor.temperature()
h = sensor.humidity()
# 3. Send formatted data via Serial (USB)
# Node-RED Parser expects: "Temperature(value)"
print("Temperature({})".format(t))
print("Humidity({})".format(h))
# 4. Turn off LED
led.value(0)
except OSError as e:
led.value(0)
print("Error: Sensor Read Failed. Retrying...")
except Exception as e:
print("Critical Error:", e)
time.sleep(INTERVAL)