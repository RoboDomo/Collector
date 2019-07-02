import MonitorBase from "@/lib/MonitorBase";

export default class Weather extends MonitorBase {
  constructor(topic, device) {
    super(topic, device);

    this.monitor([
      {
        key: "astronomy",
        members: ["sunrise", "sunset", "moonrise", "moonset", "moonPhaseDesc"]
      },
      {
        key: "observation",
        members: [
          "description",
          "baromterPressure",
          "barometerTrend",
          "comfort",
          "daylight",
          "dewPoint",
          "highTemperature",
          "humidity",
          "lowTemperature",
          "temperature",
          "windDesc",
          "windeSpeed"
        ]
      }
    ]);
  }
}
