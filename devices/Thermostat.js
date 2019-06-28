import MongoDB from "@/lib/MongoDB";
import MQTT from "@/lib/MQTT";

function makeName(n) {
  return n.replace(/\s+/g, "_").replace(/\//g, "___");
}
export default class Thermostat {
  constructor(device) {
    this.device = device;
    this.db = new MongoDB(`thermostat-${makeName(device)}`);
    this.monitor([
      "ambient_temperature",
      "humidity",
      "target_temperature_f",
      "has_leaf",
      "hvac_mode",
      "hvac_state"
    ]);
  }

  async use(collection) {
    return await this.db.use(collection);
  }

  duration(key, off) {
    let state = off;
    let start = 0;
    MQTT.subscribe(
      `nest/${this.device}/status/${key}`,
      async (topic, message) => {
        const db = await this.use(`duration_${key}`);
        if (message !== state) {
          state = message;
          if (start) {
            const duration = new Date() - start;
            await db.insertOne({
              timestamp: new Date(),
              key: key,
              start: start,
              duration: duration
            });
          }
        }
        start = new Date();
      }
    );
  }

  monitorOne(key) {
    MQTT.subscribe(
      `nest/${this.device}/status/${key}`,
      async (topic, message) => {
        const db = await this.use(key);
        await db.insertOne({ timestamp: new Date(), key: key, value: message });
      }
    );
  }

  monitor(configs) {
    if (!Array.isArray(configs)) {
      configs = [configs];
    }

    for (const config of configs) {
      this.monitorOne(config);
      this.duration(config, null);
    }
  }
}
