import MonitorBase from "@/lib/MonitorBase";

export default class Autelis extends MonitorBase {
  constructor(topic, device, deviceMap) {
    super(topic, device);
    this.deviceMap = deviceMap;
    const monitors = [];
    for (const key of Object.keys(deviceMap.forward)) {
      monitors.push(deviceMap.forward[key]);
    }
    this.monitor(monitors);
  }

  mapKey(key) {
    return this.deviceMap.backward[key];
  }
}
