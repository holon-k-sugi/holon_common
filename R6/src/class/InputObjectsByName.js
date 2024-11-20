class InputObjectsByName {
  constructor(maxPageNum) {
    this.objList = [];
    this.pageList = [...Array(maxPageNum)].map(() => []);
  }

  register(id, page) {
    this.objList.push(id);
    this.pageList[page].push(id);
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

  getValueByIndex(index) {
    const id = this.getIdsByIndex(index)[0];
    return $(`#${id}`).val();
  }

  getIndexById(id) {
    return this.getFilteredList().findIndex(arr => arr.some(v => v === id));
  }

  getLengthOfPage() {
    return this.getFilteredList().length;
  }
}
