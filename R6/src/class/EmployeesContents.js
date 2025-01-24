class EmployeesContents {
  static #list = [];
  static #previous = [];
  static initialize(employees) {
    // 現在の従業員リスト
    if (!InputObjects.objExists('DOCUMENT_EMPLOYEES_LIST')) {
      console.warn('DOCUMENT_EMPLOYEES_LISTは存在しないオブジェクト');
      return;
    }
    // 前回保存時の従業員リスト
    if (!InputObjects.objExists('PREVIOUS_DOC_EMP_LIST')) {
      console.warn('PREVIOUS_DOC_EMP_LISTは存在しないオブジェクト');
      return;
    }
    try {
      this.#previous = JSON.parse(InputObjects.getValue('PREVIOUS_DOC_EMP_LIST'));
    } catch (e) {
      this.#previous = [];
    }
    // 固有ロジックで設定する「max: 最大取り込み人数」の大きさの配列を用意し、前回保存時の従業員リストから ID を取得して格納
    const previousDocEmpContents = [...Array(employees.max ?? 0)].map((_, i) => {
      if (this.#previous.length > i) return { id: this.#previous[i].id };
      return {};
    });
    // 前回保存時の従業員リストと現在の書類の内容と合成
    Object.keys(employees.list).forEach(key => {
      [...Array(employees.max ?? 0)].forEach((_, i) => {
        const obj = [employees.list[key](i)].flat()[0];
        if (obj?.name && (obj.page === undefined || obj.page < InputObjects.getLengthOfPageListByName(obj.name)))
          previousDocEmpContents[i][key] = InputObjects.getValueByIndex(obj.name, obj.page);
      });
    });
    // 現在の従業員リストに存在しない ID の従業員情報を削除
    const subDocEmpcontents = previousDocEmpContents
      .filter(v => v.id === undefined || Employees.containsId(v.id));
    const sublength = previousDocEmpContents.length - subDocEmpcontents.length;
    // 最大取り込み人数に満たない場合、空の従業員情報を追加
    this.#list = subDocEmpcontents.concat([...Array(sublength)].map(() => ({})));
    // 現在の従業員リストの従業員情報で上書き
    this.#list.forEach((_, i) => {
      Object.keys(employees.list).forEach(key => {
        if (Employees.contains(i, key)) {
          this.#list[i][key] = Employees.getEmployeesValue(i, key);
          const objs = [employees.list[key](i)].flat();
          objs.forEach(obj => Employees.objNameSet.add(obj.name));
        }
      });
    });
    // 書類の内容を上書き
    Object.keys(employees.list).forEach(key => {
      [...Array(employees.max)].forEach((_, i) => {
        const value = this.#getEmployeesValue(i, key);
        const objList = [employees.list[key](i)].flat();
        objList.forEach(obj => {
          if (obj?.name && (obj.page === undefined || obj.page < +InputObjects.getLengthOfPageListByName(obj.name)))
            InputObjects.setValueByIndex(obj.name, obj.page, value);
        });
      });
    });
    // 現在の従業員リストを前回保存時の従業員リストに保存
    InputObjects.setValueByIndex('PREVIOUS_DOC_EMP_LIST', InputObjects.getValue('DOCUMENT_EMPLOYEES_LIST'));
  }

  static #getEmployeesValue(index, key) {
    if (this.#list[index]?.[key] === undefined) return '';
    return this.#list[index][key];
  }
}
