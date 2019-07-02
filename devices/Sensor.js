import MonitorBase from "@/lib/MonitorBase";

export default class Sensor extends MonitorBase {
  constructor(topic, type, device) {
    super(topic, device);
    this.monitor([type]);
  }
}
