class DMXMapping {
  static #xmlDataMap;
  static #CSVObjList;
  static #JSObjList;

  static initialize() {
    this.#xmlDataMap = JSON.parse($('input[name="xmlDataMap"]').val());
    this.#CSVObjList = Object.keys(this.#xmlDataMap).filter(key => this.#xmlDataMap[key].split('_')[0] === 'OBJ').map(key => key);
    this.#JSObjList = Object.keys(this.#xmlDataMap).filter(key => this.#xmlDataMap[key].split('_')[0] === 'JS').map(key => key);
    this.#JSObjList.forEach(obj => {
      if (!InputObjects.objExists(obj)) console.warn(`DMXMapping: ${obj} は不要なマッピング`);
    });
  }

  static getCSVObjList() {
    return this.#CSVObjList;
  }

  static getJSObjList() {
    return this.#JSObjList;
  }

  static getUnmappedObjList() {
    console.log('マッピングされてない項目');
    InputObjects.getAllObjNameList().forEach(name => {
      if (this.#xmlDataMap[name] === undefined) console.log(`${name}`);
    });
  }
}
