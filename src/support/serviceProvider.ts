import * as _ from "lodash";
import { injectable } from "inversify";
import ServiceProviderInterface from "./serviceProviderInterface";

@injectable()
export default class ServiceProvider implements ServiceProviderInterface {
  _app = {};

  constructor(app) {
    this._app = app;
    app.providers.push(this);
  }

  protected mergeConfigFrom(config, key) {
    $config.set(key, _.merge(config, $config.get(key)));
  }

  public boot() {}
}
