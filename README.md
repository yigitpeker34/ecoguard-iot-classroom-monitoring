# EcoGuard – Smart Classroom IoT Monitoring

IoT project for the **Internet of Things** course of the M.Sc. Professional IT Business & Digitalization at **HTW Berlin** (Winter Semester 2025/26).

EcoGuard measures temperature and humidity with an ESP32 and a DHT22 sensor, shows the live values on a Node-RED dashboard, compares them with the rest of the class via MQTT, and raises an alarm (dashboard animation, spoken warning and Telegram message) when the temperature gets too high.

## Key features

| Feature | Description |
|---|---|
| Hybrid input | Data comes either from the real sensor (ESP32 over USB serial) or from virtual sliders on the dashboard. A "Test Mode" switch on the dashboard selects the source (global variable `sim_mode`); two gate nodes let only the selected source reach the dashboard and the alarm logic. |
| Eco Brain (state machine) | Remembers the previous state (safe or danger). An alarm fires only when the temperature crosses 25 °C, and a message is sent when it returns to normal, so there is no repeated spam. |
| Multi-channel alerts | Spinning fan icon on the dashboard, spoken warning via browser text-to-speech, and a Telegram message. |
| Telegram bot | Sends the alerts and answers the `/status` command only for the configured chat ID. |
| Classroom benchmarking | Publishes the own values to `ProIT_IoT/<name>/temp` and `.../humi` and subscribes to `ProIT_IoT/+/temp` to chart all students together. |

## How it works

ESP32 with DHT22 sensor, then USB serial (115200 baud), then Node-RED (parser, gates, Eco Brain), then MQTT broker, dashboard and Telegram.

The ESP32 reads the sensor every 2 seconds and prints `Temperature(value)` and `Humidity(value)` over USB. Node-RED parses these strings into numbers. Using the serial connection instead of Wi-Fi removes network problems at the edge layer.

## Repository contents

| Path | Content |
|---|---|
| `uPython/main.py` | MicroPython firmware for the ESP32 |
| `Node-Red/flows.json` | Node-RED flow: serial input, parser, gate logic, simulation controller, MQTT, dashboard, Telegram |
| `Node-Red/eco_brain.js` | The Eco Brain function (state machine), also embedded in the flow |

## Hardware

ESP32 (WROOM-32), DHT22 sensor on GPIO 4, onboard LED on GPIO 2 (blinks during a measurement).

## Setup

1. Install MicroPython on the ESP32 and copy `uPython/main.py` to the board.
2. Install Node-RED and the palette nodes `node-red-dashboard` and `node-red-contrib-telegrambot`.
3. Import `Node-Red/flows.json` into Node-RED.
4. Set your serial port in the USB input node (the original setup used `/dev/ttyUSB0` at 115200 baud).
5. Telegram: create a bot with BotFather, enter its token in the Telegram bot configuration node, and set your own chat ID in the Eco Brain function (`myChatId`) and in the reply logic.
6. MQTT: the flow uses the HTW course broker, which may only be reachable from the university network. Replace it with any MQTT broker in the broker configuration nodes.
7. Open the dashboard at `http://localhost:1880/ui`.

To test the alarm without hardware, switch on Test Mode and raise the simulated temperature above 25 °C.

## Notes

The Telegram bot token and any credentials are not part of this repository. The project report and presentation are not included.

## Author

Yigit Peker, HTW Berlin
