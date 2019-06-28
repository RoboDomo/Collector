//import Config from "Config";
import console from "console";
import {} from "colors";
import EventEmitter from "events";
import { connect } from "mqtt";

class MQTT extends EventEmitter {
  constructor() {
    super();
    this.connect = this.connect.bind(this);
    this.cache = {};
    this.setMaxListeners(250);
  }

  connect(callback) {
    this.host = process.env.MQTT_HOST || "mqtt://robodomo";
    console.log("connecting", this.host);
    const mqtt = (this.mqtt = connect(this.host));

    mqtt.on("connect", () => {
      console.log("connected");
      this.emit("connect");
      if (callback) {
        callback();
      }
    });
    mqtt.on("failure", () => {
      console.log("mqtt", "onFailure");
      this.emit("failure");
    });

    mqtt.on("close", e => {
      console.log("mqtt", "onConnectionLost", e, this.subscriptions);
      this.emit("connectionlost");
      // mosca reonnects for us
    });
    mqtt.on("message", this.onMessageArrived.bind(this));
  }

  emitMessage(topic, payload) {
    try {
      payload = JSON.parse(payload);
    } finally {
      //
    }
    this.emit(topic, topic, payload);
  }

  onMessageArrived(topic, payload) {
    const message = payload.toString();
    //    localStorage.setItem(topic, message);
    this.cache[topic] = message;
    if (this.listenerCount(topic)) {
      console.log(
        "MQTT message      <<<".bold +
          " " +
          topic.red +
          "    " +
          message.substr(0, 60).blue
      );
      this.emitMessage(topic, message);
    }
    this.emit("message", topic, message);
  }

  subscribe(topic, handler) {
    if (!this.listenerCount(topic)) {
      console.log("MQTT SUBSCRIBE    +++".bold + " " + topic.green);
      //      console.log("MQTT subscribe", topic);
      this.mqtt.subscribe(topic);
    }
    if (handler) {
      this.on(topic, handler);
    }

    const state = this.cache[topic]; //  || localStorage.getItem(topic);
    if (state && handler) {
      setTimeout(() => {
        try {
          handler(topic, JSON.parse(state));
        } catch (e) {
          handler(topic, state);
        }
      }, 1);
    }
  }

  unsubscribe(topic, handler) {
    if (handler) {
      this.removeListener(topic, handler);
      if (!this.listenerCount(topic)) {
        console.log("MQTT UNSUBSCRIBE  ---".bold + " " + topic.green);
        //        console.log("MQTT unsubscribe", topic);
        this.mqtt.unsubscribe(topic);
      }
    } else {
      this.mqtt.unsubscribe(topic);
    }
  }

  publish(topic, message) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
      this.mqtt.publish(topic, message);
      console.log(
        "MQTT message      >>>".bold + " " + topic.red + "    " + message.blue
      );
      //      console.log("%cMQTT >>>", message, "backround:blue");
    } else {
      this.mqtt.publish(topic, String(message));
      console.log(
        "MQTT message      >>>".bold + " " + topic.red + "    " + message.blue
      );
    }
  }
}

//
export default new MQTT();
