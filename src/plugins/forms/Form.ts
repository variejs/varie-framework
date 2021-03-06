import Vue from "vue";
import filterEmpty from "./../../utilities/filterEmpty";
import ValidationServiceInterface from "../../validation/ValidationServiceInterface";

// TODO - we could use setters / getters to remove _'s for public things
class Form {
  public _rules: object = {};
  public _messages: object = {};

  protected _validator;
  protected _initialData: any;
  protected _originalData: any;

  constructor(data: object, validationService?: ValidationServiceInterface) {
    if (validationService) {
      this._validator = validationService;
    }
    this.fill(data);
    this.setAsOriginalData();
    this._initialData = this.data(false);
  }

  public fill(data) {
    for (let key in data) {
      Vue.set(this, key, data[key]);
    }
    return this;
  }

  public merge(data) {
    for (let key in data) {
      if (data[key] && this.hasOwnProperty(key)) {
        Vue.set(this, key, data[key]);
      }
    }
    return this;
  }

  public validation({ rules, messages }) {
    this._rules = rules;
    this._messages = messages;
    return this;
  }

  public isValid() {
    if (this._validator) {
      let errors = this._validator.validate(
        this.data(),
        this._rules,
        this._messages,
      );
      if (Object.keys(errors).length) {
        return false;
      }
    }
    return true;
  }

  public data(removeEmpty = true) {
    let data = {};
    let tempData = Object.assign({}, this);

    delete tempData._rules;
    delete tempData._messages;
    delete tempData._validator;
    delete tempData._initialData;
    delete tempData._originalData;

    for (let field in tempData) {
      data[`${field}`] = this[field];
    }

    if (removeEmpty) {
      return filterEmpty(data);
    }
    return data;
  }

  public setAsOriginalData() {
    this._originalData = this.data();
    return this;
  }

  public reset() {
    for (let field in this.data()) {
      this.remove(field);
    }
    this.fill(this._originalData);
    return this;
  }

  initial() {
    this.fill(this._initialData).setAsOriginalData();
    return this;
  }

  public remove(key) {
    Vue.delete(this, key);
    return this;
  }

  public errors() {
    return this._validator.validate(this.data(), this._rules, this._messages);
  }

  public isDirty(property?) {
    let data = this.data();
    let originalData = this._originalData;
    if (property) {
      return (
        (data.hasOwnProperty(property) &&
          !originalData.hasOwnProperty(property)) ||
        data[property] !== originalData[property]
      );
    }
    return JSON.stringify(data) !== JSON.stringify(originalData);
  }
}

export default Form;
