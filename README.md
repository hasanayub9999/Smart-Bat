# SmartBat — Cricket Performance Lab

A responsive, static dashboard prototype for a sensor-enabled cricket bat. Built with HTML, CSS, and vanilla JavaScript, with Chart.js for charts.

## What's included

- Overview dashboard with swing metrics and sample motion charts
- Session history with local demo session creation
- Swing analysis view with example gyroscope and accelerometer signals
- Device setup / future hardware integration roadmap
- CSV export of the demo session list
- Responsive layout for desktop and mobile

## Important: current prototype status

This is a **front-end demonstration**. All sensor readings and performance values are simulated examples. No physical device is connected, and the displayed values must not be interpreted as real measurements or validated coaching advice.

## Run locally

No build step is required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

The Chart.js library and web fonts are loaded from CDNs, so an internet connection is needed for those assets. The rest of the site is static.

For a local development server, from this folder run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Upload to GitHub

1. Create a new GitHub repository, for example `smartbat-cricket-analyzer`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. GitHub will provide the published Pages URL after deployment.

## Planned hardware/data architecture

```text
IMU sensor (accelerometer + gyroscope)
              |
       Microcontroller
              |
       USB serial / BLE
              |
       Python data service
       - timestamp + validate
       - calibrate sensor
       - segment swing events
       - calculate metrics
              |
       Local API / WebSocket
              |
       SmartBat dashboard
```

The exact board, sensor, sampling rate, mounting orientation, and communication method should be selected before implementing the live data pipeline.

## Suggested next milestones

1. Choose the microcontroller and IMU after checking compatibility, size, power, and sampling requirements.
2. Build a removable, secure sensor enclosure that does not damage or structurally alter the bat.
3. Collect stationary and controlled movement data to establish sensor axes and calibration.
4. Write Python serial/Bluetooth ingestion and save raw timestamped readings.
5. Validate derived metrics against a repeatable reference before presenting them as meaningful.
6. Connect the dashboard to the Python service and replace simulated data with actual readings.

## Project structure

```text
smartbat-cricket-analyzer/
├── index.html
├── styles.css
├── app.js
└── README.md
```
