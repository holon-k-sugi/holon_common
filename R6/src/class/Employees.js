class Employees {
  static #splitKeyValue = ['birthday', 'hire_date', 'employment_insurance_number'];
  static #list = [];
  static objNameSet = new Set();

  static initialize() {
    try {
      if (!InputObjects.objExists('DOCUMENT_EMPLOYEES_LIST')) return;
      this.#list = JSON.parse(InputObjects.getValueByIndex('DOCUMENT_EMPLOYEES_LIST', 0));
    } catch (e) {
      this.#list = [];
    }
  }

  static getList() {
    return this.#list;
  }

  static countEmployees() {
    return this.#list.length;
  }

  static contains(index, key) {
    const splitKey = key.split('_'); splitKey.pop();
    const keyPrefix = splitKey.join('_');
    return this.#list[index]?.[keyPrefix] !== undefined || this.#list[index]?.[key] !== undefined;
  }

  static containsId(id) {
    return this.#list.some(v => v.id === id);
  }

  static makeIdList() {
    return this.#list.map(v => ({ id: v.id }));
  }

  static getEmployeesValue(index, key) {
    const splitKey = key.split('_'); splitKey.pop();
    const keyPrefix = splitKey.join('_');
    const haveSplit = this.#splitKeyValue.some(v => v === keyPrefix);
    if (haveSplit) return Employees.splitEmployeesValue(index, key);
    return this.#list[index]?.[key] === undefined ? '' : this.#list[index][key];
  }

  static splitEmployeesValue(index, key) {
    const splitKey = key.split('_');
    const keyNum = +splitKey.pop();
    const keyName = splitKey.join('_');
    const notSplitValue = Employees.getEmployeesValue(index, keyName);
    if (notSplitValue === '') return '';
    if (keyName === 'birthday' || keyName === 'hire_date') return toWareki(notSplitValue)[keyNum];
    if (keyName === 'birthday_w' || keyName === 'hire_date_w') return toWareki(notSplitValue)[keyNum];
    if (keyName === 'birthday_s' || keyName === 'hire_date_s') return [+notSplitValue.slice(0, 4), +notSplitValue.slice(4, 6), +notSplitValue.slice(6, 8)][keyNum];
    if (keyName === 'employment_insurance_number') return notSplitValue.split('-')[keyNum];
    return '';
  }
}
