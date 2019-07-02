process.env.DEBUG = "collector";
process.title = "collector-microservice";

const debug = require("debug")("collector");

import MongoDB from "./lib/MongoDB";
import MQTT from "./lib/MQTT";

import Thermostat from "./devices/Thermostat";
import Weather from "./devices/Weather";
import Autelis from "./devices/Autelis";
import LGTV from "./devices/LGTV";
import Bravia from "./devices/Bravia";
import Denon from "./devices/Denon";
import Sensor from "./devices/Sensor";
import SmartThings from "./devices/SmartThings";

//const MongoClient = require("mongodb").MongoClient,
//  url = "mongodb://robodomo:27017";

const express = require("express"),
  app = express();

app.set("port", 4000);

const main = async () => {
  const monitors = [];
  MQTT.connect(async () => {
    const db = new MongoDB("settings");
    await db.use("config");

    const Config = await db.config.findOne({ _id: "config" });

    if (Config) {
      if (Config.nest && Config.nest.thermostats) {
        for (const thermostat of Config.nest.thermostats) {
          monitors.push(new Thermostat(Config.mqtt.nest, thermostat.device));
        }
      }

      if (Config.weather && Config.weather.locations) {
        for (const location of Config.weather.locations) {
          monitors.push(new Weather(Config.mqtt.weather, location.device));
        }
      }

      if (Config.autelis) {
        monitors.push(
          new Autelis(Config.mqtt.autelis, null, Config.autelis.deviceMap)
        );
      }

      if (Config.lgtv && Config.lgtv.tvs) {
        for (const tv of Config.lgtv.tvs) {
          monitors.push(new LGTV(Config.mqtt.lgtv, tv.device));
        }
      }

      if (Config.bravia && Config.bravia.tvs) {
        for (const tv of Config.bravia.tvs) {
          monitors.push(new Bravia(Config.mqtt.bravia, tv.device));
        }
      }

      if (Config.denon && Config.denon.receivers) {
        for (const receiver of Config.denon.receivers) {
          monitors.push(new Denon(Config.mqtt.denon, receiver.device));
        }
      }

      if (Config.sensors) {
        for (const sensor of Config.sensors) {
          monitors.push(
            new Sensor(
              Config.mqtt.smartthings,
              sensor.type,
              sensor.device || sensor.name
            )
          );
        }
      }

      if (Config.smartthings && Config.smartthings.things) {
        for (const thing of Config.smartthings.things) {
          monitors.push(
            new SmartThings(
              Config.mqtt.smartthings,
              thing.type,
              thing.device || thing.name
            )
          );
        }
      }
    }

    app.get("/", (req, res) => {
      res.json({ message: "Hello, world" });
    });

    app.get("/collections", async (req, res) => {
      const db = new MongoDB("robodomo");
      res.json(await db.listCollections("robodomo"));
    });

    app.get("/config", async (req, res) => {
      res.json(await db.config.findOne({ _id: "config" }));
    });

    app.get("/macros", async (req, res) => {
      res.json(await db.config.findOne({ _id: "macros" }));
    });

    // 404 handler
    app.use((req, res) => {
      res
        .status(404)
        .json({ status: 404, message: `Can't ${req.method} ${req.url}` });
    });

    app.listen(4000, () => {
      debug("listening on port 4000");
    });
  });
};

//
main();
