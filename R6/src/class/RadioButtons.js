class RadioButtons {
  static #list = {};
  static initialize() {
    this.#list = InputObjects.getAllObjNameList().reduce((cur, name) => {
      const target = cur;
      const splitName = name.split('_');
      const end = splitName.pop();
      const groupName = splitName.join('_');
      if (/^R[0-9]{1,2}$/.test(end)) {
        if (!target[groupName]) target[groupName] = new RadioButtonGroup();
        target[groupName].registerButton(`${groupName}_${end}`, +end.slice(1));
      }
      return target;
    }, {});
  }

  static getAllGroupNameList() {
    return Object.keys(this.#list);
  }

  static onClickRadioButtonL(name, index) {
    const groupName = name.split('_').slice(1).join('_');
    const preState = getV(...[name, index].filter(v => v !== undefined));
    this.#list[groupName].getAllButtonNameList().forEach(buttonName => {
      const tmp = [buttonName, index, this.#list[groupName].unmark].filter(v => v !== undefined);
      setV(...tmp);
    });
    if (preState === this.#list[groupName].mark) return;
    const tmp = [name, index, this.#list[groupName].mark].filter(v => v !== undefined);
    setV(...tmp);
  }

  static radioExists(name) {
    if (this.#list?.[name] !== undefined) {
      console.warn(`getRadioGroup: ${name} は存在しないラジオボタングループ`);
      return false;
    }
    return true;
  }

  static getRadioGroup(name) {
    if (!RadioButtons.radioExists(name)) return {};
    return this.#list[name];
  }

  static getValue(name, index) {
    if (!RadioButtons.radioExists(name)) return '';
    return RadioButtons.getRadioGroup(name).getValue(index);
  }

  static setMark(name, mark, unmark) {
    if (!RadioButtons.radioExists(name)) return;
    RadioButtons.getRadioGroup(name).setMark(mark, unmark);
  }

  static countButtons(name) {
    if (!RadioButtons.radioExists(name)) return {};
    return RadioButtons.getRadioGroup(name).countButtons();
  }
}
