class InputObjectsByName {
  constructor(maxPageNum) {
    this.objList = [];
    this.pageList = [...Array(maxPageNum)].map(() => []);
    this.type = '';
  }

  register(id, page) {
    this.objList.push(id);
    this.pageList[page].push(id);
    if (this.type === '') this.type = $(`#${id}`).prop('type');
  }

  getId() {
    return this.objList[0];
  }

  getALLIds() {
    return this.objList;
  }

  getIdsByPage(page) {
    return this.pageList[page];
  }

  getFilteredList() {
    return this.pageList.filter(v => v.length !== 0);
  }

  getIdsByIndex(index) {
    return this.getFilteredList()[index];
  }

  getType() {
    return this.type;
  }

  getValue() {
    return this.getValueByIndex(0);
  }

  getValueByIndex(index) {
    const id = this.getIdsByIndex(index)[0];
    if (this.type === 'checkbox') return $(`#${id}`).prop('checked');
    if (this.type === 'text') return $(`#${id}`).val();
    return '';
  }

  getIndexById(id) {
    return this.getFilteredList().findIndex(arr => arr.some(v => v === id));
  }

  getLengthOfPage() {
    return this.getFilteredList().length;
  }
}
