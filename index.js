process.env.DEBUG = "collector";
const debug = require("debug")("collector");

import MongoDB from "./lib/MongoDB";
import MQTT from "./lib/MQTT";

import Thermostat from "./devices/Thermostat";

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

    for (const thermostat of Config.nest.thermostats) {
      monitors.push(new Thermostat(thermostat.device));
    }

    app.get("/", (req, res) => {
      res.json({ message: "Hello, world" });
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
