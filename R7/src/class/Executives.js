class Executives {
  static #list = [];
  static #numOfexecutives = 0;

  static initialize(executivesList) {
    this.#list = JSON.parse(InputObjects.getValue(executivesList) || '[]');
    this.#numOfexecutives = this.#list.length;
  }

  static getNumOfExecutives() {
    return this.#numOfexecutives;
  }

  static getValue(type, index) {
    const value = this.#list?.[type]?.[index] || '';
    return value || '';
  }
}
