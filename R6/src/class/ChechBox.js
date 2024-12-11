class ChechBox {
  static #list = {};
  static initialize() {
    this.#list = InputObjects.getAllObjNameList().reduce((cur, name) => {
      const id = InputObjects.getObjByName(name).getId();
      if ($(`#${id}`).prop('type') === 'checkbox') {
        cur[name] = InputObjects.getObjByName(name);
      }
      return cur;
    }, {});
    ChechBox.validateCheckMark();
  }

  static isCheckBox(name) {
    return this.#list[name] !== undefined;
  }

  static validateCheckMark() {
    Object.keys(this.#list).forEach(name => {
      const id = this.#list[name].getId();
      if ($(`#${id}`).prop('value') === 'true' && $(`#${id}`).prop('value') === 'false') {
        return;
      }
      console.warn(`${name} のチェック値が不正です。`);
    });
  }
}
