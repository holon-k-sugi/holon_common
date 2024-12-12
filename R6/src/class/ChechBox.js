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
      if ($(`#${id}`).attr('value') !== 'true') {
        console.warn(`${name} のチェック時の書き出し値が true ではなく ${$(`#${id}`).attr('value')} です。`);
      }
      if ($(`#${id}`).attr('data-unchecked-value') !== 'false') {
        console.warn(`${name} の非チェック時の書き出し値が false ではなく ${$(`#${id}`).attr('value')} です。`);
      }
      return;
    });
  }
}
