class RadioButtons {
  static #list = {};
  static initialize() {
    this.#list = InputObjects.getAllObjNameList().reduce((cur, name) => {
      const target = cur;
      const splitName = name.split('_');
      const end = splitName.slice(-1)[0];
      const groupName = splitName.slice(0, -1).join('_');
      if (/^R[0-9]+$/.test(end)) {
        if (!target[groupName]) target[groupName] = new RadioButtonGroup();
        target[groupName].registerButton(name, +end.split('R')[1]);
      }
      return target;
    }, {});
  }

  static getAllGroupNameList() {
    return Object.keys(this.#list);
  }

  static onClickRadioButtonL(name, index) {
    console.log(name, index);
    const groupName = name.split('_').slice(0, -1).join('_');
    const preState = getV(...[name, index].filter(v => v !== undefined));
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
