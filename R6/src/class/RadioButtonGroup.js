class RadioButtonGroup {
  constructor() {
    this.buttonList = {};
    this.reverseList = {};
  }

  getAllButtonNameList() {
    return Object.keys(this.buttonList);
  }

  getButtonNum(name) {
    return this.buttonList[name];
  }

  getButtonName(num) {
    return this.reverseList[num];
  }

  registerButton(name, num) {
    this.buttonList[name] = num;
    this.reverseList[num] = name;
    if (this.mark === undefined) {
      try {
        const type = InputObjects.getObjByName(name).getType();
        if (type === 'checkbox') {
          this.mark = true;
          this.unmark = false;
        }
        if (type === 'text') {
          this.mark = '◯';
          this.unmark = '​';
        }
      } catch (e) {
        console.warn(e);
      }
    }
  }

  setMark(mark, unmark) {
    this.mark = mark;
    if (unmark !== '') this.unmark = unmark;
  }

  buttonExists(num) {
    return this.reverseList[num] !== undefined;
  }

  synchronizeButton(index) {
    this.getAllButtonNameList().forEach(name => {
      [...Array(InputObjects.getLengthOfPageListByName(name))].forEach((_, i) => {
        setV(name, i, getV(name, index));
      });
    });
  }

  getValue(index) {
    return Object.keys(this.reverseList)
      .find(num => getV(this.reverseList[num], index) === this.mark);
  }

  setCorrectMark() {
    const isWrong = this.getAllButtonNameList()
      .map(name => getV(name) === this.mark).filter(v => v).length > 1;
    if (isWrong) this.getAllButtonNameList().forEach(name => {
      setV(name, this.unmark);
    });
  }

  countButtons() {
    return Object.keys(this.buttonList).length;
  }
}
