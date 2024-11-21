if (window.allObj != undefined) {
  initializeInstances();
  if (getV('DOCUMENT_STATUSES-STATUS') === '3') return;
  executeFuncitonsOnload();
  initialize();
  onLoad();
  onChange();
  lazyEvaluationFunctions.setFunction('onLoad', onLoad);
}

function initialize() {
  radioSetting();
  onLoadDocumentEmployeesList(makeListForDocumentEmployeesList());
  onLoadIcon(iconSetting());
}

function iconSetting() {
  return {
    acrossYears: false, // 年度またぎの複製可能か true or false
    addPage: [], // ページ追加対象ユニット番号
    inputEmployees: [], // 従業員取り込み対象ユニット番号
    varticalPositions: [], // アイコンの垂直位置 [unitIndex, verticalPosition]
  };
}

function radioSetting() {
}

function makeListForDocumentEmployeesList() {
  const ret = { list: {}, max: 0 };
  return ret;
}

function onLoad() {
}
function onChange() {
}
