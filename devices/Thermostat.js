import MonitorBase from "@/lib/MonitorBase";
//import MongoDB from "@/lib/MongoDB";
//import MQTT from "@/lib/MQTT";

export default class Thermostat extends MonitorBase {
  constructor(topic, device) {
    super(topic, device);
    this.monitor([
      "ambient_temperature_f",
      "humidity",
      "target_temperature_f",
      "has_leaf",
      "hvac_mode",
      "hvac_state"
    ]);
  }
}
