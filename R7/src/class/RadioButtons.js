class RadioButtons {
  static #list = {};

  static initialize() {
    this.#list = InputObjects.getAllObjNameList().reduce((cur, name) => {
      const target = cur;
      const splitName = name.split('_');
      const end = splitName.slice(-1)[0];
      const groupName = splitName.slice(0, -1).join('_');
      if (RadioButtons.isRadioButton(name)) {
        if (!target[groupName]) target[groupName] = new RadioButtonGroup();
        target[groupName].registerButton(name, +end.split('R')[1]);
      }
      return target;
    }, {});
  }

  static isRadioButton(name) {
    const suffix = name.split('_').slice(-1)[0];
    return /^R[0-9]+$/.test(suffix);
  }

  static getAllGroupNameList() {
    return Object.keys(this.#list);
  }

  static getAllButtonNameList(name) {
    if (!RadioButtons.radioExists(name)) return [];
    return RadioButtons.getRadioGroup(name).getAllButtonNameList();
  }

  static onClickRadioButtonL(name, index) {
    const groupName = name.split('_').slice(0, -1).join('_');
    const type = InputObjects.getObjByName(name).getType();
    const value = InputObjects.getValueByIndex(name, index);
    const preState = type === 'checkbox' ? !value : value;
    RadioButtons.getRadioGroup(groupName).getAllButtonNameList().forEach(buttonName => {
      const tmp = [buttonName, index, RadioButtons.getRadioGroup(groupName).unmark].filter(v => v !== undefined);
      setV(...tmp);
    });
    if (preState === RadioButtons.getRadioGroup(groupName).mark) return;
    const tmp = [name, index, RadioButtons.getRadioGroup(groupName).mark].filter(v => v !== undefined);
    setV(...tmp);
  }

  static radioExists(name) {
    if (this.#list?.[name] === undefined) return false;
    return true;
  }

  static getRadioGroup(name) {
    if (!RadioButtons.radioExists(name)) {
      console.warn(`getRadioGroup: ${name} は存在しないラジオボタングループ`);
      return {};
    }
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
