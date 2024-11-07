class IconObjects {
  static #iconList = {
    acrossYears: {
      name: 'CAPTION_ACROSS_YEARS',
      string: '前年度から複製可能',
      color: 'rgba(230,100,0,1)',
      iconType: 'label',
      isEnabled: iconSetting => iconSetting.acrossYears,
      getPages: () => [2],
    },
    addPage: {
      name: 'CAPTION_COPY_PAGE',
      string: 'ページ追加可能',
      color: 'rgba(190,0,0,1)',
      iconType: 'label',
      isEnabled: iconSetting => Array.isArray(iconSetting.addPage) && iconSetting.addPage.length !== 0 && PageList.isFrontPage(iconSetting.addPage),
      getPages: iconSetting => iconSetting.addPage,
    },
    inputEmployees: {
      name: 'CAPTION_INPUT_EMPLOYEES',
      string: '従業員参照可能',
      color: 'rgba(0,30,100,1)',
      iconType: 'label',
      isEnabled: iconSetting => Array.isArray(iconSetting.inputEmployees) && iconSetting.inputEmployees.length !== 0 && PageList.isFrontPage(iconSetting.inputEmployees),
      getPages: iconSetting => iconSetting.inputEmployees,
    },
    copyPage1: {
      name: 'COPY_PAGE_BUTTON',
      string: '1ページ目引用',
      color: 'rgba(68,201,194,1)',
      iconType: 'button',
      isEnabled: () => PageList.addPages.length > 0,
      getPages: () => PageList.addPages,
    },
    csvNum: {
      name: 'SHOW_CSV_NUM_BUTTON',
      string: 'CSV番号を表示する',
      color: 'rgba(68,201,194,1)',
      iconType: 'button',
      isEnabled: () => true,
      getPages: () => [2],
    },
  };

  static showIcon(iconSetting) {
    const iconsByPage = [...Array(PageList.getLength())].map(_ => Array(1));

    Object.keys(this.#iconList).forEach(iconName => {
      const target = this.#iconList[iconName];
      if (target.isEnabled(iconSetting)) target.getPages(iconSetting).forEach(index => iconsByPage[index - 1].push(iconName));
    });
    const veticalPosition = iconSetting.varticalPositions.reduce((acc, [index, position]) => {
      const target = acc;
      target[index - 1] = position;
      return target;
    }, {});
    iconsByPage.forEach((icons, i) => {
      if (icons.length === 0) return;
      const $labelsDiv = $('<div>');
      $labelsDiv.css('padding', '10pt');
      $labelsDiv.css('display', 'flex');
      $labelsDiv.css('text-align', 'left');
      $labelsDiv.css('width', '50%');
      const $buttonsDiv = $('<div>');
      $buttonsDiv.css('padding', '10pt');
      $buttonsDiv.css('display', 'flex');
      $buttonsDiv.css('justify-content', 'end');
      $buttonsDiv.css('width', '50%');

      icons.forEach(icon => {
        const iconDiv = this.#makeIconDiv(this.#iconList[icon]);
        const $tmp = iconDiv.clone();
        if (this.#iconList[icon].iconType === 'label') $labelsDiv.append($tmp);
        if (this.#iconList[icon].iconType === 'button') {
          $tmp.css('float', 'right');
          $tmp.css('pointer-events', 'auto');
          $buttonsDiv.append($tmp);
        }
      });
      const $iconsDiv = $('<div>');
      $iconsDiv.attr('id', 'ICONS_DIV');
      $iconsDiv.css('pointer-events', 'none');
      $iconsDiv.css('display', 'flex');
      $iconsDiv.css('width', '595pt');
      $iconsDiv.css('height', '40pt');
      const id = PageList.indexToSelector(i).children('[class~="iftc_cf_inputitems"]').attr('id');
      $iconsDiv.css('position', 'absolute');
      const inputAreaCSS = this.#getPtValueFromStylesheets(`#${id}`);
      const inputAreaTop = Number(inputAreaCSS?.top.split('pt')[0] || 0);
      $iconsDiv.css('top', `${(veticalPosition[i] !== undefined ? veticalPosition[i] : 0) - inputAreaTop}pt`);
      const inputAreaLeft = Number(inputAreaCSS?.left.split('pt')[0] || 0);
      $iconsDiv.css('left', `${-inputAreaLeft}pt`);
      $iconsDiv.append($labelsDiv);
      $iconsDiv.append($buttonsDiv);

      PageList.indexToSelector(i).children('[class~="iftc_cf_inputitems"]').append($iconsDiv);
    });
  }

  static #makeIconDiv(target) {
    const fontSize = 8;
    const iconDiv = $('<div>');
    iconDiv.prop('type', 'button');
    iconDiv.prop('tabindex', '-1');
    iconDiv.css('margin', '0pt 2pt');
    iconDiv.css('cursor', target.iconType === 'button' ? 'pointer' : 'default');
    iconDiv.css('font-weight', 'bold');
    iconDiv.css('font-family', 'メイリオ');
    iconDiv.css('padding', '2pt 0pt');
    iconDiv.css('font-size', `${fontSize}pt`);
    iconDiv.css('color', target.iconType === 'label' ? target.color : 'white');
    iconDiv.css('background', target.iconType === 'label' ? 'white' : target.color);
    iconDiv.css('border', `solid 2px ${target.color}`);
    iconDiv.css('border-radius', '5px');
    iconDiv.css('text-align', 'center');
    iconDiv.css('display', 'inline-block');
    iconDiv.css('width', `${(target.string.length + 2) * fontSize}pt`);
    iconDiv.attr('id', target.name);
    iconDiv.text(target.string);
    return iconDiv;
  }

  static #getPtValueFromStylesheets(selector) {
    let result;
    [...document.styleSheets].some(styleSheet => [...styleSheet.cssRules].some(rule => {
      if (rule.selectorText === selector) {
        result = rule.style;
        return true;
      }
      return false;
    }));
    return result;
  }
}
