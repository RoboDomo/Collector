import MonitorBase from "@/lib/MonitorBase";

export default class Denon extends MonitorBase {
  constructor(topic, device) {
    super(topic, device);
    this.monitor(["CVC", "DC", "MS", "MU", "SI", "SD", "PW"]);
  }
}
