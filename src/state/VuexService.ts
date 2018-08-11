import Vue from "vue";
import * as camelCase from "camelcase";
import Vuex, { Module, Store } from "vuex";
import { inject, injectable } from "inversify";
import StateServiceInterface from "./StateServiceInterface";
import ApplicationInterface from "../foundation/ApplicationInterface";

@injectable()
export default class VuexService implements StateServiceInterface {
  private files;
  private app: ApplicationInterface;

  protected store: Store<any>;

  constructor(@inject("app") app: ApplicationInterface) {
    Vue.use(Vuex);
    this.app = app;
    this.store = new Vuex.Store<any>({});
    this.store = this.buildModules();
    this.store.registerModule("varie", {
      namespaced: true
    });
  }

  public getStore(): Store<any> {
    return this.store;
  }

  private buildModules() {
    // try {
    this.files = require.context("@store", true, /^\.\/.*index\.(ts)$/);
    this.files.keys().forEach(filename => {
      this.createStore(filename, this.getModule(filename));
    });
    // } catch (e) {
    // console.warn(e);
    // console.warn(
    //   "You have loaded the store module without having a store folder, please add `app/store` folder!"
    // );
    // }

    return this.store;
  }

  private getModule(filename) {
    let moduleAbstractName = camelCase(
      `store ${this.getModuleName(filename).join(" ")}`
    );
    $app.$container.bind(moduleAbstractName).to(this.files(filename).default);
    let module: Module<any, any> = this.app.make(moduleAbstractName);
    module.modules = {};
    module.namespaced = true;
    return module;
  }

  private createStore(filename: string, module: Module<any, any>) {
    this.store.registerModule(this.getModuleName(filename), module);
  }

  private getModuleName(filename: string) {
    return filename
      .replace(/^\.\//, "")
      .replace(/index\.ts/, "")
      .replace(/index\.js/, "")
      .replace(/\/$/, "")
      .replace(/modules\//g, "")
      .split("/");
  }
}
