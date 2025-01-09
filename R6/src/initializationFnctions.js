// ライブラリ内関数
function logWarningWithCaller(message) {
  const error = new Error();
  const stack = error.stack.split('\n');
  const callerInfo = stack[2].trim();
  console.warn(`${message}\nCalled by: ${callerInfo}`);
}

// Load 時実行
// eslint-disable-next-line no-unused-vars
function onLoadCompanyMaster() {
  [...Array(3)].forEach((_, i) => {
    setV(`JGYNSHBIRTHDAY_${['Y', 'M', 'D'][i]}`, getMaster('JGYNSHBIRTHDAY').slice(i * 2, i * 2 + 2));
  });
  if (!InputObjects.objExists('IS_MANUAL') || !getCheckValue('IS_MANUAL')) return;
  Object.keys(CompanyMaster).forEach(type => {
    if (type === 'SHRSH' && (getMaster('TENANT_ID') === getMaster('CREATED_TENANT_ID'))) return;
    CompanyMaster.setAllMasterByType(type);
  });

  if (getMaster('TENANT_ID') !== getMaster('CREATED_TENANT_ID')) {
    if (!getCheckValue('IS_MANUAL'))
      setV('SHRSH_NUM', InputObjects.getValue('LSS_ATTORNEY_REGIST_NUMBER') === '' ? InputObjects.getValue('S_LSS_ATTORNEY_REGIST_NUMBER') : InputObjects.getValueByIndex('LSS_ATTORNEY_REGIST_NUMBER'));
    $(getSelector('IS_MANUAL')).on('click', () => {
      if (!getCheckValue('IS_MANUAL')) {
        CompanyMaster.setAllMasterByType('SHRSH');
        setV('SHRSH_NUM', InputObjects.getValue('LSS_ATTORNEY_REGIST_NUMBER') === '' ? InputObjects.getValue('S_LSS_ATTORNEY_REGIST_NUMBER') : InputObjects.getValueByIndex('LSS_ATTORNEY_REGIST_NUMBER'));
      }
    });
  }
  if (InputObjects.objExists('LSIO') && InputObjects.objExists('ROUKI_NAME') && getV('LSIO') !== '')
    setV('ROUKI_NAME', InputObjects.getValue('LSIO').split('労働基準監督署')[0]);
}
// eslint-disable-next-line no-unused-vars
function onLoadRadioButton() {
  RadioButtons.getAllGroupNameList().forEach(groupName => {
    RadioButtons.getRadioGroup(groupName).getAllButtonNameList().forEach(name => {
      const num = getP(name);
      [...Array(num)].forEach((_, i) => {
        $(getSelector(name, i)).off('click.initializeButton').on('click.initializeButton', () => {
          RadioButtons.onClickRadioButtonL(name, i);
          $(getSelector(name, i)).each((_i, elm) => {
            if (!/[a-z]/.test($(elm).attr('name'))) RadioButtons.getRadioGroup(groupName).synchronizeButton(i);
          });
        });
      });
    });
    RadioButtons.getRadioGroup(groupName).setCorrectMark();
  });
}
// eslint-disable-next-line no-unused-vars
function onLoadDocumentEmployeesList(employees) {
  if (!InputObjects.objExists('DOCUMENT_EMPLOYEES_LIST')) {
    console.warn('DOCUMENT_EMPLOYEES_LISTは存在しないオブジェクト');
    return;
  }
  if (!InputObjects.objExists('PREVIOUS_DOC_EMP_LIST')) {
    console.warn('PREVIOUS_DOC_EMP_LISTは存在しないオブジェクト');
    return;
  }
  const docEmpContents = new DocumentEmployeesContents(employees);
  // 配列を利用して書類の内容を上書き
  Object.keys(employees.list).forEach(key => {
    [...Array(employees.max)].forEach((_, i) => {
      const value = docEmpContents.getEmployeesValue(i, key);
      let objList = employees.list[key](i);
      if (!objList) return;
      if (!Array.isArray(objList)) objList = [objList];
      objList.forEach(obj => {
        if (!obj?.name) return;
        if (obj.page < getP(obj.name) || obj.page === undefined) setV(obj.name, obj.page, value);
      });
    });
  });
  setV('PREVIOUS_DOC_EMP_LIST', getV('DOCUMENT_EMPLOYEES_LIST'));
}
// eslint-disable-next-line no-unused-vars
function onLoadIcon(iconSetting) {
  IconObjects.showIcon(iconSetting);
  onClickCopyPageButton();
  createCSVLabel();
}
// eslint-disable-next-line no-unused-vars
function onClickCopyPageButton() {
  $(document).on('click', '#COPY_PAGE_BUTTON', evt => {
    const parent = $(evt.currentTarget).parent().parent().parent();
    const page = parent.attr('id').split('_')[3] - 1;
    InputObjects.getObjListByPage(page).forEach(obj => {
      if (DocumentEmployees.objNameSet.has(obj.name)) return;
      setV(obj.name, getIndexById(obj.id), getV(obj.name, 0));
    });
    LazyEvaluationFunctions.onLoad();
  });
}

// eslint-disable-next-line no-unused-vars
function toggleCSVLabel() {
  let isVisible = false;
  return () => {
    isVisible = !isVisible;
    $('#SHOW_CSV_NUM_BUTTON').text(!isVisible ? 'CSV番号を表示する' : 'CSV番号を隠す');
    $('.csv-num').css('visibility', !isVisible ? 'hidden' : '');
  };
}
// eslint-disable-next-line no-unused-vars
function createCSVLabel() {
  const callToggleCSVLabel = toggleCSVLabel();
  $('#SHOW_CSV_NUM_BUTTON').on('click', () => {
    callToggleCSVLabel();
  });
  const csvObjList = DMXMapping.getCSVObjList();
  const cssPrp = {
    background: 'rgba(68,201,194,1)',
    color: 'white',
    position: 'absolute',
    'align-items': 'center',
    'font-weight': 'bold',
    'font-family': 'メイリオ',
    display: 'flex',
    'justify-content': 'center',
  };
  // CSV項目の中で hidden に設定されているオブジェクトを udefined に設定する。
  const visibleObj = csvObjList.map((csv, i) => {
    if (!InputObjects.objExists(csv)) {
      console.warn(`CSV番号 ${i + 1} 番: ${csv} は存在しないオブジェクト`);
      return undefined;
    }
    const isHidden = [...document.styleSheets].some(ss => [...ss.cssRules].some(rule => {
      if (!rule.selectorText) return false;
      const splitSelectorText = rule.selectorText.split('_');
      splitSelectorText.shift();
      splitSelectorText.pop();
      splitSelectorText.pop();
      const name = splitSelectorText.join('_');
      return name === csv && rule.style.visibility === 'hidden';
    }));
    if (isHidden) {
      console.warn(`CSV番号 ${i + 1} 番: ${csv} は欄外のオブジェクト`);
      return undefined;
    }
    return csv;
  });
  visibleObj.forEach((csv, i) => {
    if (csv === undefined) return;
    const maxFontSizePt = '14pt';
    const tmpDiv = $('<div>');
    tmpDiv.css('font-size', maxFontSizePt);
    tmpDiv.attr('id', 'tmp-div');
    $('#iftc_cf_page_1').after(tmpDiv);
    const maxFontSizePx = Number($('#tmp-div').css('font-size').split('px')[0]);
    $(getSelector(csv)).each((_, elm) => {
      const csvDiv = ['width', 'left', 'top', 'visibility'].reduce((target, cur) => {
        if (cur === 'visibility') target.css(cur, 'hidden');
        else target.css(cur, $(elm).css(cur));
        return target;
      }, $('<div>'));
      const minFontSize = Math.min(($(elm).css('width').split('px')[0]) / ((i + 1).toString().length), $(elm).css('height').split('px')[0] - 2);
      const fontSize = Math.min(minFontSize, maxFontSizePx);
      const topPadding = 2;
      csvDiv.css('line-height', `${$(elm).css('height').split('px')[0] - topPadding}px`);
      csvDiv.css('padding', `${topPadding}px 0px 0px`);
      csvDiv.css('font-size', `${fontSize}px`);
      csvDiv.addClass('csv-num');
      Object.keys(cssPrp).forEach(key => csvDiv.css(key, cssPrp[key]));
      csvDiv.text(i + 1);
      $(elm).after(csvDiv);
    });
  });
}

// eslint-disable-next-line no-unused-vars
function showDocInfo() {
  const formName = $('input[name="jobName"]').val();
  console.log(`フォーム名：${formName.slice(0, 1) === 'J' ? formName.slice(1) : formName} `);
  const libUrl = $('script[src*="form_lib"]').attr('src').split('?')[0].split('/');
  console.log(`ライブラリ名：${libUrl.find(v => v.indexOf('form_lib_') > -1)} `);
  const ver = libUrl.find(v => v.indexOf('@') > -1);
  console.log(`ライブラリVer: ${ver === undefined ? 'なし' : ver} `);
}

function showErrorConfig() {
  const errConfig = [
    { class: 'iftc_cf_checknum', formatType: '数値' },
    { class: 'iftc_cf_checkpercent', formatType: 'パーセント' },
    { class: 'iftc_cf_formatdate', formatType: '日付' },
  ];
  errConfig.forEach(obj => {
    if ($(`.${obj.class}`).length > 0) {
      const name = $(`.${obj.class}`).attr('id').split('_').slice(1, -2).join('_');
      console.warn(`${name} に${obj.formatType}のフォーマットが設定されています。`);
    }
  });
}

function showDuplicateObject() {
  const initialPages = PageList.getIndexOfInitialPages();
  InputObjects.getDuplicateObject().forEach(name => {
    const initialPageObjCount = InputObjects.getObjByName(name).getPageList().filter(page => initialPages.includes(page)).length;
    if (initialPageObjCount > 2) console.warn(`${name} は重複しています。`);
  });
}

// eslint-disable-next-line no-unused-vars
function initializeInstances() {
  InputObjects.initialize();
  RadioButtons.initialize();
  DocumentEmployees.initialize();
  PageList.initialize();
  DMXMapping.initialize();
  ChechBox.initialize();
  defineAttrAll();
}

// eslint-disable-next-line no-unused-vars
function executeFuncitonsOnload() {
  showDocInfo();
  onLoadRadioButton();
  setFocusColor();
  onLoadCompanyMaster();
  if (window.location.hostname === 'stg.joseikin-cloud.jp') {
    console.log('---STG用デバッグ情報開始---');
    getUnmappedObjList();
    showErrorConfig();
    showDuplicateObject();
    console.log('---STG用デバッグ情報終了---');
  }
}
