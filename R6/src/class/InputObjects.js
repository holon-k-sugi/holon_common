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
    if (this.#list[name] === undefined) throw new Error(`InputObjects.getObjByName: ${name} は存在しないオブジェクト`);
    return this.#list[name];
  }

  static getAllIds(name) {
    try {
      return InputObjects.getObjByName(name).getALLIds();
    } catch (e) {
      console.warn(e);
      return [];
    }
  }

  static getLengthOfPageListByName(name) {
    try {
      return InputObjects.getObjByName(name).getLengthOfPage();
    } catch (e) {
      console.warn(e);
      return 0;
    }
  }

  static getIdsbyPage(name, page) {
    try {
      const idList = InputObjects.getObjByName(name).getIdsByPage(page);
      if (idList === undefined) throw new Error(`${page} ページ目に ${name} は存在しない`);
      return idList;
    } catch (e) {
      return [];
    }
  }

  static getIdsByIndex(name, index) {
    try {
      const list = InputObjects.getObjByName(name).getFilteredList();
      if (list[index] === undefined) throw new Error(`${name} が存在するページ数は ${index + 1} より少ない`);
      return list[index];
    } catch (e) {
      console.warn(e);
      return [];
    }
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

  static getValue(name) {
    try {
      return InputObjects.getObjByName(name).getValue();
    } catch (e) {
      console.warn(e);
      return '';
    }
  }

  static getValueByIndex(name, index) {
    try {
      return InputObjects.getObjByName(name).getValueByIndex(index ?? 0);
    } catch (e) {
      console.warn(e);
      return '';
    }
  }

  static setValueByIndex(...args) {
    const target = args.length === 2 || (args.length === 3 && args[1] === undefined)
      ? InputObjects.getAllIds(args[0]) : InputObjects.getIdsByIndex(args[0], args[1]);
    const val = args.slice(-1)[0];
    target.forEach(id => {
      if ($(`#${id}`).prop('type') === 'checkbox') {
        const display = val ? 'inline' : 'none';
        $(`#label${id} svg`).attr('style', `display: ${display};`);
        $(`#${id}`).prop('checked', val);
        return;
      }
      $(`#${id}`).val(val);
    });
  }
}
