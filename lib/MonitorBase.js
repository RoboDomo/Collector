import MongoDB from "@/lib/MongoDB";
import MQTT from "@/lib/MQTT";

const debug = require("debug")("MonitorBase");

function makeName() {
  const name = [],
    args = Array.prototype.slice.call(arguments);
  let arg;

  while ((arg = args.shift())) {
    if (arg) {
      name.push(arg.replace(/\s+/g, "").replace(/\//g, ""));
    }
  }
  return name.join("_");
}

export default class MonitorBase {
  constructor(topic, device) {
    this.topic = topic;
    this.device = device;
    this.db = new MongoDB("robodomo");
    this.collectionPrefix = makeName(topic, device);
  }

  async use(collection) {
    return await this.db.use(collection);
  }

  duration(key, member) {
    let state = null;
    let start = 0;
    const status = this.topic === "smartthings" ? "" : "status/";
    const device = this.device ? this.device + "/" : "";
    MQTT.subscribe(
      `${this.topic}/${device}${status}${key}`,
      async (topic, message) => {
        const db = await this.use(
          makeName(this.collectionPrefix, "duration", member || key)
        );
        const value = member ? message[member] : message;
        if (value !== state) {
          state = value;
          if (start) {
            const duration = new Date() - start;
            await db.insertOne({
              timestamp: new Date(),
              key: this.mapKey(key),
              member: member,
              start: start,
              duration: duration
            });
          }
        }
        start = new Date();
      }
    );
  }

  mapKey(key) {
    return key;
  }

  monitorOne(key, member) {
    const device = this.device ? this.device + "/" : "";
    const status = this.topic === "smartthings" ? "" : "status/";
    MQTT.subscribe(
      `${this.topic}/${device}${status}${key}`,
      async (topic, message) => {
        const db = await this.use(
          makeName(this.collectionPrefix, "monitor", member || key)
        );
        const value = member ? message[member] : message;
        debug("monitorOne", key, member, value);
        await db.insertOne({
          timestamp: new Date(),
          key: this.mapKey(key),
          value: value
        });
      }
    );
  }

  monitor(configs) {
    if (!Array.isArray(configs)) {
      configs = [configs];
    }

    for (const config of configs) {
      if (typeof config === "string") {
        this.monitorOne(config);
        this.duration(config);
      } else {
        const members = Array.isArray(config.members)
          ? config.members
          : [config.members];
        for (const member of members) {
          this.monitorOne(config.key, member);
          this.duration(config.key, member);
        }
      }
    }
  }
}
