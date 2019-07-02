import MonitorBase from "@/lib/MonitorBase";

export default class LGTV extends MonitorBase {
  constructor(topic, device) {
    super(topic, device);
    this.monitor([
      { key: "power" },
      { key: "mute", members: ["mute"] },
      { key: "foregroundApp", members: ["appId"] }
    ]);
  }
}
