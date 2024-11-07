class InputObjects {
  static #MAX_PAGE_NUM = 50;
  static #list = {};
  static #objListByPage = [];

  static initialize() {
    this.#objListByPage = Array.from({ length: this.#MAX_PAGE_NUM }, () => []);
    this.#list = allObj.reduce(this.#processObject.bind(this), {});
  }

  static #processObject(acc, id) {
    const { objName, page } = this.#parseId(id);
    this.#objListByPage[page].push({ name: objName, id });

    if (!acc[objName]) acc[objName] = new InputObjectsByName(this.#MAX_PAGE_NUM);
    acc[objName].register(id, page);

    return acc;
  }

  static #parseId(id) {
    const splitId = id.split('_');
    const slicedId = splitId.slice(1, -1);
    const page = parseInt(slicedId.pop(), 10);
    const objName = slicedId.join('_');
    return { objName, page };
  }

  static getAllObjNameList() {
    return Object.keys(this.#list);
  }

  static getObjByName(name) {
    if (this.#list[name] === undefined) {
      logWarningWithCaller(`${name} は存在しないオブジェクト`);
      return new InputObjectsByName(this.#MAX_PAGE_NUM);
    }
    return this.#list[name];
  }

  static getAllIds(name) {
    return InputObjects.getObjByName(name).getALLIds();
  }

  static getLengthOfPageListByName(name) {
    return InputObjects.getObjByName(name).getLengthOfPage();
  }

  static getIdsbyPage(name, page) {
    if (InputObjects.getObjByName(name).getIdsByPage(page) === undefined) {
      console.warn(`${page} ページ目に ${name} は存在しない`);
      return [];
    }
    return InputObjects.getObjByName(name).getIdsByPage(page);
  }

  static getIdsByIndex(name, index) {
    const list = InputObjects.getObjByName(name).getFilteredList();
    if (list[index] === undefined) {
      console.warn(`${name} が存在するページ数は ${index + 1} より少ない`);
      return [];
    }
    return list[index];
  }

  static objExists(name) {
    return this.#list[name] !== undefined;
  }

  static getIndexById(id) {
    const splitId = id.split('_');
    splitId.shift(); splitId.pop(); splitId.pop();
    const objName = splitId.join('_');
    return this.#list[objName].getIndexById(id);
  }

  static getObjListByPage(page) {
    return this.#objListByPage[page];
  }
}
