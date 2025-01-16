class EmployeesContents {
  constructor(employees) {
    try {
      if (!InputObjects.objExists('PREVIOUS_DOC_EMP_LIST')) {
        this.previous = [];
        return;
      }
      this.previous = JSON.parse(getV('PREVIOUS_DOC_EMP_LIST'));
    } catch (e) {
      this.previous = [];
    }
    // employees.max の大きさの配列を用意し、PREVIOUS_DOC_EMP_LIST から Id を格納
    const previousDocEmpContents = [...Array(employees.max ?? 0)].map((_, i) => {
      if (this.previous.length > i) return { id: this.previous[i].id };
      return {};
    });
    // 現在の書類の内容と合成
    Object.keys(employees.list).forEach(key => {
      [...Array(employees.max ?? 0)].forEach((_, i) => {
        let obj = employees.list[key](i);
        if (!obj) return;
        if (Array.isArray(obj)) [obj] = obj;
        if (!obj?.name) return;
        if (obj.page === undefined
          || obj.page < getP(obj.name)) previousDocEmpContents[i][key] = getV(obj.name, obj.page);
      });
    });
    // DOCUMENT_EMPLOYEES_LIST に存在しない ID のデータを削除
    const subDocEmpcontents = previousDocEmpContents
      .filter(v => v.id === undefined || documentEmployees.containsId(v.id));
    const sublength = previousDocEmpContents.length - subDocEmpcontents.length;
    const docEmpContents = subDocEmpcontents.concat([...Array(sublength)].map(() => ({})));
    // DOCUMENT_EMPLOYEES_LIST の内容で上書き
    docEmpContents.forEach((_, i) => {
      Object.keys(employees.list).forEach(key => {
        if (documentEmployees.contains(i, key)) {
          docEmpContents[i][key] = documentEmployees.getEmployeesValue(i, key);
          let objs = employees.list[key](i);
          if (!objs) return;
          if (!Array.isArray(objs)) objs = [objs];
          objs.forEach(obj => documentEmployees.objNameSet.add(obj.name));
        }
      });
    });
    this.list = docEmpContents;
  }

  getEmployeesValue(index, key) {
    if (this.list[index]?.[key] === undefined) return '';
    return this.list[index][key];
  }

  countElm() {
    return this.list.length;
  }
}
