// 汎用関数
// eslint-disable-next-line no-unused-vars
function getV(name, index) {
  if (RadioButtons.radioExists(name)) return RadioButtons.getValue(name, index);
  return InputObjects.getValueByIndex(name, index);
}
// eslint-disable-next-line no-unused-vars
function setV(...args) { // (name, val) or (name, index, val)
  InputObjects.setValueByIndex(...args);
}
// eslint-disable-next-line no-unused-vars
function getMaster(name) { return InputObjects.getValueByIndex(name); }
// eslint-disable-next-line no-unused-vars
function getN(name, i) {
  const hankakuNumber = Number(toHan(getV(name, i)).replace(/,/g, ''));
  if (getV(name, i) === '' || Number.isNaN(hankakuNumber)) return 0;
  setV(name, i, hankakuNumber.toLocaleString('ja-JP'));
  return hankakuNumber;
}
// eslint-disable-next-line no-unused-vars
function setN(...args) {
  if (args.length > 3) {
    console.warn('引数が多すぎます。');
    return;
  }
  const name = args[0];
  const index = args.length === 3 ? args[1] : undefined;
  const val = args.slice(-1)[0];
  if (Number.isNaN(Number(val))) console.warn(`${name} にセットしようとしている ${val} は数値ではありません`);
  const tmp = Number.isNaN(Number(val)) ? val.toString().replace(/[^0-9]/g, '') : Number(val).toLocaleString('ja-JP');
  const ret = [name, index, val === '' ? '' : tmp].filter(v => v !== undefined);
  setV(...ret);
}
// eslint-disable-next-line no-unused-vars
function getP(name) {
  return InputObjects.getLengthOfPageListByName(name);
}
// eslint-disable-next-line no-unused-vars
function setMark(name, mark, unmark) {
  RadioButtons.setMark(name, mark, unmark);
}
// eslint-disable-next-line no-unused-vars
function toHan(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/[－]/g, '-');
}
// eslint-disable-next-line no-unused-vars
function isCheckBox(id) {
  return $(`#${id}`).prop('type') === 'checkbox';
}
// eslint-disable-next-line no-unused-vars
function getIds(name, index = undefined) {
  if (index === undefined) return InputObjects.getAllIds(name);
  return InputObjects.getIdsByIndex(name, index);
}
// eslint-disable-next-line no-unused-vars
function getSelector(name, index = undefined) {
  return getIds(name, index).map(id => `#${id}`).join();
}
// eslint-disable-next-line no-unused-vars
function makeSelector(names) {
  return names.map(name => {
    if (RadioButtons.radioExists(name)) return RadioButtons.getAllButtonNameList(name).map(n => getSelector(n));
    return getSelector(name);
  }).flat().filter(v => v).join();
}
// eslint-disable-next-line no-unused-vars
function getLabelSelector(name, index = undefined) {
  return getIds(name, index).map(id => `#label${id}`).join();
}
// eslint-disable-next-line no-unused-vars
function getObjectName(evt) {
  const splitId = evt.currentTarget.id.split('_');
  splitId.shift(); splitId.pop(); splitId.pop();
  return splitId.join('_');
}
// eslint-disable-next-line no-unused-vars
function getCheckValue(name, index = 0) {
  return $(`#${InputObjects.getAllIds(name)[index]}`).prop('checked');
}
// eslint-disable-next-line no-unused-vars
function setCheckValue(...args) {
  setV(...args);
}
// eslint-disable-next-line no-unused-vars
function getIndexById(id) {
  return InputObjects.getIndexById(id);
}
// eslint-disable-next-line no-unused-vars
function getIndexByEvt(evt) {
  return InputObjects.getIndexById(evt.currentTarget.id);
}
// eslint-disable-next-line no-unused-vars
function getValueByEvt(evt) {
  return $(`#${evt.currentTarget.id}`).val();
}
// eslint-disable-next-line no-unused-vars
function toWareki(dateString) {
  const date = new Date(dateString.slice(0, 4), dateString.slice(4, 6) - 1, dateString.slice(6, 8));
  const wareki = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { era: 'long' }).format(date);
  return [wareki.split('/'), wareki.slice(0, 2), wareki.slice(2).split('/')].flat();
}
// eslint-disable-next-line no-unused-vars
function getDateFromFieldId(yearId, monthId, dayId, type = 2) {
  const toNumber = fieldId => {
    if (Number.isInteger(fieldId)) return fieldId;
    if (Number.isInteger(getV(fieldId))) return getV(fieldId);
    const numString = (getV(fieldId) || '').replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)).replace(/[^0-9]/g, '');
    return Number(numString);
  };
  const japanese2Christian = (id, t = 2) => {
    if (Number.isInteger(id)) return id;
    if ([0, 1988, 2018][t] === null) return id;
    return (getV(id) === '元' ? 1 : toNumber(id)) + [0, 1988, 2018][t];
  };
  const result = {
    year: japanese2Christian(yearId, type),
    month: toNumber(monthId),
    day: toNumber(dayId),
  };
  return result;
}
// eslint-disable-next-line no-unused-vars
function calculateDeadline(year, month, day, subMonth, subDay) {
  const toDoubleDigits = x => (`0${x}`).slice(-2);
  const toDateField = dt => [dt.getFullYear(), toDoubleDigits(dt.getMonth() + 1), toDoubleDigits(dt.getDate())].join('/');
  const refDt = new Date(Number(year), Number(month) - 1, Number(day) + subDay);
  const lastDay = new Date(refDt.getFullYear(), refDt.getMonth() + subMonth + 1, 0);
  let result;
  if (refDt.getDate() > lastDay.getDate()) result = lastDay;
  else result = new Date(refDt.getFullYear(), refDt.getMonth() + subMonth, refDt.getDate() + (subMonth <= 0 ? 0 : -1));
  return toDateField(result);
}
// eslint-disable-next-line no-unused-vars
function calcPeriod(yearId, monthId, dayId, subMonth, subDay, type) {
  const args = [yearId, monthId, dayId, subMonth, subDay];
  const isValid = args.reduce((acc, cur) => acc || cur === undefined, false);
  if (isValid) return '';
  const date = getDateFromFieldId(yearId, monthId, dayId, type);
  const ymdIsZero = [date.year, date.month, date.day].map(ymd => ymd !== 0).reduce((acc, cur) => acc && cur);
  if (!ymdIsZero) return '';
  return calculateDeadline(date.year, date.month, date.day, subMonth, subDay);
}
// eslint-disable-next-line no-unused-vars
function calcPeriodFromDate(dateId, subMonth = 0, subDay = 0) {
  if (!dateId) return '';
  if (!getV(dateId)) return '';
  const splitDate = getV(dateId).split('/');
  return calculateDeadline(splitDate[0], splitDate[1], splitDate[2], subMonth, subDay);
}
// eslint-disable-next-line no-unused-vars
function calculateSubstractDate(year, month, day, subMonth, subDay) {
  const toDD = x => (`0${x}`).slice(-2);
  const toDateField = dt => [dt.getFullYear(), toDD(dt.getMonth() + 1), toDD(dt.getDate())].join('/');
  const result = new Date(Number(year), Number(month) - 1 + subMonth, Number(day) + subDay);
  return toDateField(result);
}
// eslint-disable-next-line no-unused-vars
function calcSubDate(yearId, monthId, dayId, subMonth, subDay, type) {
  const args = [yearId, monthId, dayId, subMonth, subDay];
  const isValid = args.reduce((acc, cur) => acc || cur === undefined, false);
  if (isValid) return '';
  const date = getDateFromFieldId(yearId, monthId, dayId, type);
  const ymdIsZero = [date.year, date.month, date.day].map(ymd => ymd !== 0).reduce((acc, cur) => acc && cur);
  if (!ymdIsZero) return '';
  return calculateSubstractDate(date.year, date.month, date.day, subMonth, subDay);
}
// eslint-disable-next-line no-unused-vars
function calcSubDateFromDate(dateId, subMonth = 0, subDay = 0) {
  if (!dateId) return '';
  if (!getV(dateId)) return '';
  const splitDate = getV(dateId).split('/');
  return calculateSubstractDate(splitDate[0], splitDate[1], splitDate[2], subMonth, subDay);
}

// eslint-disable-next-line no-unused-vars
function setFocusColor() {
  const fieldTabIdSelector = InputObjects.getAllObjNameList().map(name => InputObjects
    .getAllIds(name).map(id => {
      if ($(`#${id} `).attr('tabindex') > 0) return `#${id} `;
      return undefined;
    }).filter(v => v).join()).filter(v => v).join();
  const focusColor = 'rgba(155,185,225,0.75)';
  const fieldTabColor = 'rgba(199,218,244,0.5)';
  // 手入力可能なフィールドに色を付ける。
  $(fieldTabIdSelector).css('background', fieldTabColor);
  // フォーカスのあたっているフィールドに色を付ける。
  $(fieldTabIdSelector).on({
    focus: evt => $(evt.target).css('background', focusColor),
    blur: evt => $(evt.target).css('background', fieldTabColor),
  });
}
// eslint-disable-next-line no-unused-vars
function visualizeObj(captionList = [], inputList = [], labelList = []) {
  const log = n => console.warn(`visualizeObj: ${n} は存在しないラベル`);
  const makeSelectorList = (list, callback) => list.map(n => {
    if (InputObjects.objExists(n)) return callback(n);
    log(n);
    return '';
  }).filter(v => v).join().split(',');

  const captionObj = makeSelectorList(captionList, getSelector);
  $(captionObj.join()).prop('disabled', true);
  $(captionObj.join()).css('font-weight', 'bold');
  const inputObj = makeSelectorList(inputList, getSelector);
  const lableObj = makeSelectorList(labelList, getLabelSelector);

  const names = [captionObj, inputObj, lableObj].flat();
  [...document.styleSheets].some(ss => {
    const result = names.map(name => [...ss.cssRules]
      .find(rule => rule.selectorText && rule.selectorText.indexOf(name) !== -1));
    result.forEach(x => { if (x) x.style.visibility = ''; });
    return result.reduce((x, y) => x && y);
  });
}

// eslint-disable-next-line no-unused-vars
function makeArray(num, prefix, first, deference) {
  return [...Array(num)].map((_, i) => `${prefix}${first + i * deference} `);
}

// eslint-disable-next-line no-unused-vars
function textBoxToSelectBox(names = [], options = []) {
  names.forEach(n => {
    [...Array(getP(n))].forEach((_, p) => {
      const selector = getSelector(n, p);
      const tmp = $(selector).val();
      $(selector).replaceWith($('<select></select>', $(selector).attrAll()));
      options.forEach(([name, value]) => {
        $(selector).append($('<option>').html(name).val(value ?? name));
      });
      $(selector).val(tmp);
    });
  });
}

/**
 * OBJ_XXXX と JS_OBJ_XXXX のマッピングを入れ替えた際に値の受け渡しを行う。
 * @param  {...any} args[0] - 古いマッピングのオブジェクト名
 * @param  {...any} args[1] - 新しいマッピングのオブジェクト名
 * 追加ページの場合は下記の利用方法となる。
 * @param  {...any} args[0] - 古いマッピングのオブジェクト名
 * @param  {...any} args[1] - 古いマッピングのオブジェクト名のページインデックス
 * @param  {...any} args[2] - 新しいマッピングのオブジェクト名
 * @param  {...any} args[3] - 新しいマッピングのオブジェクト名のページインデックス
 */
// eslint-disable-next-line no-unused-vars
function setValueFromOldObjToNewObj(...args) {
  const oldObj = args[0];
  const oldObjIndex = args.length === 2 ? undefined : args[1];
  const newObj = args.length === 2 ? args[1] : args[2];
  const newObjIndex = args.length === 2 ? undefined : args[3];
  const isRadio = RadioButtons.radioExists(newObj);
  const suffix = i => (isRadio ? `_R${i + 1}` : '');
  const loopCount = isRadio ? RadioButtons.countButtons(oldObj) : 1;
  [...Array(loopCount)].forEach((_, i) => {
    if (getV(`${newObj}${suffix(i)}`, newObjIndex) === '') setV(`${newObj}${suffix(i)}`, newObjIndex, getV(`${oldObj}${suffix(i)}`, oldObjIndex));
    else setV(`${oldObj}${suffix(i)}`, oldObjIndex, getV(`${newObj}${suffix(i)}`, newObjIndex));
  });
  const selector = isRadio
    ? makeSelector(RadioButtons.getRadioGroup(newObj).getAllButtonNameList()) : getSelector(newObj);
  const event = isRadio ? 'click' : 'click change';
  $(selector).on(event, () => {
    [...Array(loopCount)].forEach((_, i) => {
      setV(`${oldObj}${suffix(i)}`, oldObjIndex, getV(`${newObj}${suffix(i)}`, newObjIndex));
    });
  });
}

function defineAttrAll() {
  (function _defineAttrAll($) {
    $.fn.attrAll = function attrAll() {
      const attr = this.get(0).attributes;
      return [...Array(attr.length)].reduce((acc, _, i) => {
        acc[attr[i].name] = attr[i].value;
        return acc;
      }, {});
    };
  }(jQuery));
}

// eslint-disable-next-line no-unused-vars
function getUnmappedObjList() {
  DMXMapping.getUnmappedObjList();
}

// eslint-disable-next-line no-unused-vars
function logWarningWithCaller(message) {
  const error = new Error();
  const stack = error.stack.split('\n').slice(1).map(v => v.split('(')[0]).join('\n');
  console.warn(`${message}\n${stack}`);
}

// eslint-disable-next-line no-unused-vars
function fillAllFields(value) {
  enableScriptOnload(false);
  const objNameList = InputObjects.getAllObjNameList();

  const denylist = [
    'TARGET_USER_NAME',
    'DOCUMENT_STATUSES-STATUS',
    'AMOUNT_RECEIVED',
    'RESERVE_ITEM01',
    'RESERVE_ITEM02',
    'TARGET_COMPANY_NAME',
    'SUPPLY_DOCUMENT_START_DATE',
    'DOCUMENT_DEADLINE_DATE',
    'DOCUMENT_REMARKS-TYPE',
    'DOCUMENT_ITEMS-UPDATED_AT',
    'SKIP_RUN_SCRIPT_ON_LOAD',
  ];
  const valueDict = {
    radioButton: '◯',
    checkbox: true,
  };
  objNameList.filter(v => !denylist.includes(v)).forEach(name => {
    const maxLength = InputObjects.getMaxLengthOfInput(name);
    if (maxLength > 0) {
      InputObjects.setValueByIndex(name, [...Array(+maxLength)].map((_, i) => (i + 1) % 10).join(''));
      return;
    }
    const type = RadioButtons.isRadioButton(name) ? 'radioButton' : InputObjects.getType(name);
    InputObjects.setValueByIndex(name, valueDict[type] ?? value);
  });
}

function enableScriptOnload(runScriptOnload = true) {
  InputObjects.setValueByIndex('SKIP_RUN_SCRIPT_ON_LOAD', runScriptOnload ? '' : 'ᅟ');
  console.log(`ロジックが実行され${runScriptOnload ? 'る' : 'ない'}ように設定しました。`);
}

// eslint-disable-next-line no-unused-vars
function shouldRunScriptOnLoad() {
  // HANGUL CHOSEONG FILLER を判定に利用
  const skipScriptOnload = InputObjects.getValue('SKIP_RUN_SCRIPT_ON_LOAD') === 'ᅟ';
  if (!skipScriptOnload) return true;
  console.log('ロジックが実行されません、実行する場合は下記のコマンドを実行して保存し、リロードしてください。');
  console.log('enableScriptOnload()');
  return false;
}

// eslint-disable-next-line no-unused-vars
function getEmployeesValue(index, key) {
  return Employees.getEmployeesValue(index, key);
}
