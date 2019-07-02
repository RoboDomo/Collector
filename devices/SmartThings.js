import MonitorBase from "@/lib/MonitorBase";

export default class SmartThings extends MonitorBase {
  constructor(topic, type, device) {
    super(topic, device);
    switch (type) {
      case "dimmer":
      case "fan":
        this.monitor(["switch", "level"]);
        break;
      default:
        this.monitor([type]);
        break;
    }
  }
}
