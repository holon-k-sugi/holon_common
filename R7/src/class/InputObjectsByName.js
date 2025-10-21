class InputObjectsByName {
  constructor(maxPageNum) {
    this.objList = [];
    this.objListByPage = [...Array(maxPageNum)].map(() => []);
    this.type = '';
    this.getValueFunction = undefined;
  }

  register(id, page, type, getValueFunction) {
    this.objList.push(id);
    this.objListByPage[page].push(id);
    if (this.type === '') this.type = type || $(`#${id}`).prop('type');
    if (!this.getValueFunction) this.getValueFunction = getValueFunction || this.defaultGetValueFunction();
  }

  defaultGetValueFunction() {
    if (this.type === 'checkbox') return id => $(`#${id}`).prop('checked');
    return id => $(`#${id}`).val();
  }

  getId() {
    return this.objList[0];
  }

  getALLIds() {
    return this.objList;
  }

  getPageList() {
    return this.objListByPage.map((n, i) => {
      if (n.length > 0) return i + 1;
      return undefined;
    }).filter(v => v !== undefined);
  }

  getIdsByPage(page) {
    return this.objListByPage[page];
  }

  getFilteredList() {
    return this.objListByPage.filter(v => v.length !== 0);
  }

  getIdsByIndex(index) {
    return this.getFilteredList()[index];
  }

  getType() {
    return this.type;
  }

  getValueByIndex(index) {
    const id = this.getIdsByIndex(index)[0];
    return this.getValueFunction(id);
  }

  getValue() {
    return this.getValueByIndex(0);
  }

  getIndexById(id) {
    return this.getFilteredList().findIndex(arr => arr.some(v => v === id));
  }

  getLengthOfPage() {
    return this.getFilteredList().length;
  }

  getMaxLengthOfInput() {
    return $(`#${this.getId()}`).attr('maxlength');
  }
}
