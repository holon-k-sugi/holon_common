class ChechBox {
  static #list = {};

  static initialize() {
    this.#list = InputObjects.getAllObjNameList().reduce((cur, name) => {
      try {
        const id = InputObjects.getObjByName(name).getId();
        if ($(`#${id}`).prop('type') === 'checkbox') cur[name] = InputObjects.getObjByName(name);
      } catch (e) {
        console.warn(e);
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
      const checkedValue = $(`#${id}`).attr('value');
      if (checkedValue !== 'true') console.warn(`${name} のチェック時の書き出し値が true ではなく ${checkedValue} です。`);

      const unchedValue = $(`#${id}`).attr('data-unchecked-value');
      if (unchedValue !== 'false') console.warn(`${name} の非チェック時の書き出し値が false ではなく ${unchedValue} です。`);
    });
  }
}
