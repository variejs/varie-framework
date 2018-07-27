import Vue from "vue";
import { PluginObject } from "vue";
import FormsPlugin from "./FormsPlugin";
import ServiceProvider from "../../support/ServiceProvider";

export default class NotificationsServiceProvider extends ServiceProvider {
  public boot() {
    Vue.use(this.app.make<PluginObject<any>>("$FormsPlugin"));
  }
  public register() {
    this.app.singleton("$FormsPlugin", FormsPlugin);
  }
}
