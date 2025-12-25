// Load 時実行
// eslint-disable-next-line no-unused-vars
function onLoadCompanyMaster() {
  if (!InputObjects.objExists('IS_MANUAL') || !getCheckValue('IS_MANUAL')) {
    CompanyMaster.setAllMaster();
    onLoadExecutives();
  }
  if (InputObjects.objExists('IS_MANUAL')) $(getSelector('IS_MANUAL')).on('click', () => {
    if (!getCheckValue('IS_MANUAL')) {
      CompanyMaster.setAllMaster();
      onLoadExecutives();
    }
  });
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
  EmployeesContents.initialize(employees);
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
      if (Employees.objNameSet.has(obj.name)) return;
      setV(obj.name, getIndexById(obj.id), getV(obj.name, 0));
    });
    LazyEvaluationFunctions.onLoad?.();
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
  console.log(`ライブラリVer：${ver === undefined ? 'なし' : ver} `);
  const amountReceived = InputObjects.getValue('AMOUNT_RECEIVED');
  console.log(`支給額：${amountReceived === '' ? '未入力' : `${isNaN(amountReceived) ? amountReceived : Number(amountReceived).toLocaleString()} 円`} `);
  const setTargetUserName = InputObjects.getValue('TARGET_USER_NAME');
  console.log(`対象者氏名：${setTargetUserName === '' ? '未入力' : setTargetUserName} `);
}

function showErrorConfig() {
  const errConfig = [
    { class: 'iftc_cf_checknum', formatType: '数値' },
    { class: 'iftc_cf_checkpercent', formatType: 'パーセント' },
    { class: 'iftc_cf_formatdate', formatType: '日付' },
  ];
  errConfig.forEach(obj => {
    if ($(`.${obj.class}`).length > 0) {
      const name = $(`.${obj.class}`).attr('id').split('_').slice(1, -2)
        .join('_');
      console.warn(`${name} に${obj.formatType}のフォーマットが設定されています。`);
    }
  });
}

function showDuplicateObject() {
  const initialPages = PageList.getIndexOfInitialPages();
  InputObjects.getAllObjNameList().forEach(name => {
    if (InputObjects.getObjByName(name).getIdsByPage(0).length > 0) return;
    const initialPageObjCount = initialPages.map(page => InputObjects.getObjByName(name).getIdsByPage(page).length).reduce((a, b) => a + b);
    if (initialPageObjCount > 1) console.warn(`${name} は重複しています。`);
  });
}

function linkifyTspanText() {
  $('svg').each((_, svgContainer) => {
    const $svgContainer = $(svgContainer);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    $svgContainer.find('tspan').each((__, tspan) => {
      const $tspan = $(tspan);
      const text = $tspan.text().replace(/\r?\n/g, '');
      // URLが含まれているかチェック
      if (urlRegex.test(text)) {
        // URL部分を抽出
        const urls = text.match(urlRegex);
        // 複数のURLが含まれている場合の処理
        if (urls.length > 1) {
          console.warn('テキストオブジェクトに複数のURLが含まれています。');
          return;
        }
        $tspan.on('click', () => {
          window.open(urls[0], '_blank');
        });
        $tspan.on({
          mouseenter: e => {
            $(e.currentTarget).css('cursor', 'pointer');
          },
          mouseleave: e => {
            $(e.currentTarget).css('cursor', 'default');
          },
        });
      }
    });
  });
}

function getWrongFormIdentifiers() {
  // ページインデックスを付与していない場合
  // id = '_ITEXT4000_7_0' name = 'ITEXT4000'
  // ページインデックスを付与している場合
  // id = '_ITEXT5004_8_12' name = 'ITEXT5004_J24J03A00K10p10_0'

  const addPageIndex = $('div[id^="iftc_cf_inputarea_"]').children().filter((_, el) => /_0$/.test(el.name));
  const formIdentifiers = {};
  addPageIndex.each((_, elm) => {
    // id からオブジェクト名を取得
    // '_ITEXT4000_7_0' -> 'ITEXT4000'
    const objName = $(elm).attr('id').split('_').slice(1, -2)
      .join('_');
    // form ファイル名から正しい識別子を取得
    // '_ITEXT5004_8_12' -> 'ITEXT5004_J24J03A00K10p10_0'
    if ($(elm).attr('name') === objName) return true;
    const formIdentifier = $(elm).attr('name').replace(objName, '').split('_')
      .slice(1, -1)
      .join('_');
    const parentClass = $(elm).closest('div[class^="iftc_cf_form_"]').attr('class');
    const formFileName = parentClass.replace('iftc_cf_form_', '').replace(' iftc_cf_pageframe', '');
    const correctIdentifier = formFileName.split('_').join('');

    if (formIdentifiers[formFileName] === undefined && formIdentifier !== correctIdentifier) formIdentifiers[formFileName] = correctIdentifier;
    return true;
  });
  Object.keys(formIdentifiers).forEach(formIdentifier => {
    console.warn(`${formIdentifier} の識別子が間違っています。正しい識別子は下記です。`);
    console.warn(`${formIdentifiers[formIdentifier]}`);
  });
}

function onLoadExecutives() {
  const prefix = 'EXECUTIVES_';
  const suffixes = {
    NAME: { key: 'full_name', value: x => x },
    NAME_KANA: { key: 'full_name_kana', value: x => x },
    POSITION: { key: 'post', value: x => x },
    BIRTHDAY_Y: { key: 'birthday', value: x => Number(String(x).slice(0, 4)) || '' },
    BIRTHDAY_M: { key: 'birthday', value: x => Number(String(x).slice(4, 6)) || '' },
    BIRTHDAY_D: { key: 'birthday', value: x => Number(String(x).slice(6, 8)) || '' },
  };
  const MAX_PAGE_NUM = 5;
  const MAX_OBJECTS_NUM = 20;
  const tenantID = InputObjects.getValue('TENANT_ID');
  const lastTenantID = InputObjects.getValue('LAST_TENANT_ID');
  if (tenantID !== lastTenantID) InputObjects.getAllObjNameList().forEach(name => {
    const splitName = name.split('_');
    if (splitName[0] === 'EXECUTIVES') {
      const pageNum = InputObjects.getLengthOfPageListByName(name);
      [...Array(pageNum)].forEach((_, i) => InputObjects.setValueByIndex(name, i, ''));
    }
  });

  [...Array(Executives.getNumOfExecutives())].reduce(({ page, obji }, _, num) => {
    const result = { page, obji };
    const existsInPage = [...Array(MAX_PAGE_NUM - page)].some((__, i) => {
      const existsInIndex = [...Array(MAX_OBJECTS_NUM - obji)].some((___, j) => {
        const name = `${prefix}NAME_${result.obji + j}`;
        if (!InputObjects.objExists(name)) return false;
        if (InputObjects.getLengthOfPageListByName(name) - 1 < (result.page + i)) return false;
        Object.keys(suffixes).forEach(suffix => {
          const value = suffixes[suffix].value(Executives.getValue(suffixes[suffix].key, num));
          const objName = `${prefix}${suffix}_${result.obji + j}`;
          if (!InputObjects.objExists(objName)) return;
          if (value === '') return;
          InputObjects.setValueByIndex(objName, result.page + i, value);
        });
        result.page += i;
        result.obji += j + 1;
        return true;
      });
      if (!existsInIndex || MAX_OBJECTS_NUM - obji === result.obji) result.obji = 0;
      return existsInIndex;
    });
    if (!existsInPage && MAX_PAGE_NUM - page !== 0) result.page += 1;
    return result;
  }, { page: 0, obji: 0 });
}

function setTenantID() {
  InputObjects.setValueByIndex('LAST_TENANT_ID', InputObjects.getValue('TENANT_ID'));
}

/**
 * 指定された要素のスタイルに基づき、1文字（ここでは半角数字）の幅を測定する関数
 * @param {jQuery} $elm - スタイルを適用したいinput要素のjQueryオブジェクト
 * @returns {number} 1文字の幅（px）
 */
function getCharacterWidth($elm) {
  // 測定用の一時的な要素を作成
  const $measurer = $('<span>0</span>');

  // スタイルをコピー（font-size, font-familyなど）
  $measurer.css({
    'font-family': $elm.css('font-family'),
    'font-size': $elm.css('font-size'),
    visibility: 'hidden',
    position: 'absolute',
    'white-space': 'nowrap',
    'letter-spacing': '0', // letter-spacingが影響しないようにリセット
  });

  // bodyに追加して幅を測定
  $('body').append($measurer);
  const charWidth = $measurer.width();

  // 測定用要素を削除
  $measurer.remove();

  return charWidth;
}

/**
 * input要素のmaxlength分の文字を、左右に半分の間隔を空けて均等配置する関数
 * @param {string} selector - 対象のinput要素のセレクター
 */
function applyJustifiedSpacing(selector) {
  const $elm = $(selector);

  // 1. 必要な値の取得
  const elementWidth = $elm.width();
  const maxLength = parseInt($elm.attr('maxlength'), 10);
  const textAlign = $elm.css('text-align');

  // 文字数が1以下の場合は何もしない
  if (maxLength < 1 || Number.isNaN(maxLength)) {
    $elm.css({ 'letter-spacing': 'normal' });
    return;
  }

  // 2. 1文字の幅を測定
  const characterWidth = getCharacterWidth($elm);

  // 3. 計算処理
  const totalCharWidth = characterWidth * maxLength;
  const totalSpace = elementWidth - totalCharWidth;
  const letterSpacing = totalSpace / maxLength;
  const halfSpacing = letterSpacing / 2;

  // 4. text-alignに応じたスタイル設定
  const styleConfig = {
    left: {
      paddingLeft: halfSpacing,
      paddingRight: 0
    },
    start: {
      paddingLeft: halfSpacing,
      paddingRight: 0
    },
    right: {
      paddingLeft: 0,
      paddingRight: halfSpacing
    },
    end: {
      paddingLeft: 0,
      paddingRight: halfSpacing
    },
    center: {
      paddingLeft: halfSpacing,
      paddingRight: halfSpacing
    },
  };

  const config = styleConfig[textAlign] || styleConfig.center;

  // 5. CSSの適用
  $elm.css({
    'letter-spacing': `${letterSpacing.toFixed(2)}px`,
    'padding-left': `${config.paddingLeft.toFixed(2)}px`,
    'padding-right': `${config.paddingRight.toFixed(2)}px`,
  });

  // 6. 右寄せまたは左寄せの場合、テキストの末尾にletter-spacingをキャンセルする要素を追加
  if (textAlign === 'right' || textAlign === 'end') {
    // 既存のキャンセル要素を削除
    $elm.find('.letter-spacing-cancel').remove();

    // 負のletter-spacingを持つspan要素を追加
    $elm.append(`<span class="letter-spacing-cancel" style="letter-spacing: ${(-letterSpacing).toFixed(2)}px;">&nbsp;</span>`);
  } else $elm.find('.letter-spacing-cancel').remove();
}

function setEqualSpacing() {
  const allPages = $('div[id^="iftc_cf_inputarea_"]').find('[maxlength]');
  allPages.each((_, elm) => {
    applyJustifiedSpacing(elm);
  });
}

function showWrongFileName() {
  const formFileName = PageList.getFileNameList();
  formFileName.forEach(name => {
    const splitName = name.split('_');
    const isFormInformation = splitName[1].substring(1, 2) === '0';
    const isCover = splitName[2] === 'cover';
    if (isFormInformation && !isCover) console.warn(`${name} のファイル名が間違っています。様式情報には必ず cover をつけてください。`);
  });
}

// eslint-disable-next-line no-unused-vars
function initializeInstances() {
  InputObjects.initialize();
  RadioButtons.initialize();
  Employees.initialize();
  PageList.initialize();
  DMXMapping.initialize();
  ChechBox.initialize();
  Executives.initialize('EXECUTIVES_LIST');
  defineAttrAll();
}

// eslint-disable-next-line no-unused-vars
function debugOnStg() {
  console.log('---STG用デバッグ情報開始---');
  getUnmappedObjList();
  showErrorConfig();
  showDuplicateObject();
  showWrongFileName();
  console.log('---STG用デバッグ情報終了---');
}

// eslint-disable-next-line no-unused-vars
function executeFuncitonsOnload() {
  showDocInfo();
  onLoadRadioButton();
  setFocusColor();
  onLoadCompanyMaster();
  linkifyTspanText();
  getWrongFormIdentifiers();
  setEqualSpacing();
  if (window.location.hostname === 'stg.joseikin-cloud.jp') debugOnStg();
  setTenantID();
}
