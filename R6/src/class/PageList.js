class PageList {
  static #list = {};
  static #addPages = [];
  static #frontPages = [];
  static #length = 0;

  static initialize() {
    this.#list = $('[id^="iftc_cf_page_"]');
    this.#addPages = this.getIndexOfAddPages();
    this.#frontPages = this.getIndexOfFrontPages();
    this.#length = this.#list.length;
  }

  static indexToSelector(index) {
    return this.#list.eq(index);
  }

  static getIndexOfAddPages() {
    const tmp = new Set();
    const ret = [...this.#list]
      .map(v => [...v.classList.values()].find(s => s.indexOf('iftc_cf_form_') > -1))
      .map((str, i) => {
        if (tmp.has(str)) return i + 1;
        tmp.add(str);
        return false;
      }).filter(v => v !== false);
    return ret;
  }

  static getIndexOfFrontPages() {
    const tmp = new Set();
    const notFrontPageWord = ['hidden', 'rear'];
    const ret = [...this.#list]
      .map(v => (
        {
          id: v.id,
          class: [...v.classList.values()].find(s => s.indexOf('iftc_cf_form_') > -1),
        }
      )).map((obj, i) => {
        if (notFrontPageWord.map(w => obj.class.indexOf(w) > -1)
          .reduce((a, b) => a || b)) return false;
        if (tmp.has(obj.class)) return false;
        tmp.add(obj.class);
        return i + 1;
      }).filter(v => v !== false);
    return ret;
  }

  static getIndexOfInitialPages(){
    const addPageSet = new Set(PageList.getIndexOfAddPages());
    return PageList.getIndexOfFrontPages().filter(page => !addPageSet.has(page));
  }

  static isFrontPage(units) {
    return units.map(unit => {
      const isFront = this.#frontPages.some(v => unit === v);
      if (!isFront) console.warn(`ユニット番号 ${unit} は隠しページまたは裏面なのでアイコンまたはボタンを表示できません。`);
      return isFront;
    }).reduce((a, b) => a || b);
  }

  static getLength() {
    return this.#length;
  }

  static getAddPages(){
    return this.#addPages;
  }

  static getLengthOfAddPage() {
    return this.#addPages.length;
  }
}
