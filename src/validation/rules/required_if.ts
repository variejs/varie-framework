import { getByDot } from "./../../utilities";

export default {
  passes(value: any, parameters: [], data: {}): Boolean {
    if (!value) {
      if (getByDot(data, parameters[0]) === parameters[1]) {
        return false;
      }
    }
    return true;
  },

  replacers() {
    return ["other", "value"];
  }
};
