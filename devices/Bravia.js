import MonitorBase from "@/lib/MonitorBase";

export default class Bravia extends MonitorBase {
  constructor(topic, device) {
    super(topic, device);
    this.monitor([{ key: "power" }, { key: "nowPlaying", members: ["title"] }]);
  }
}
