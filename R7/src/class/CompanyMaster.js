class CompanyMaster {
  static #hasObjPrefix = {
    SHRSH: {
      SHRSH_POST: 'S_BUSINESS_OWNER_POSTAL_CODE',
      SHRSH_AD1: 'S_BUSINESS_OWNER_ADDRESS_1',
      SHRSH_AD2: 'S_BUSINESS_OWNER_ADDRESS_2',
      SHRSH_OFFICE: 'S_BUSINESS_OWNER_NAME',
      SHRSH_TEL: 'S_BUSINESS_OWNER_TEL',
      SHRSH_POST1: 'S_BUSINESS_OWNER_POSTAL_CODE_1',
      SHRSH_POST2: 'S_BUSINESS_OWNER_POSTAL_CODE_2',
      SHRSH_TEL1: 'S_BUSINESS_OWNER_TEL_1',
      SHRSH_TEL2: 'S_BUSINESS_OWNER_TEL_2',
      SHRSH_TEL3: 'S_BUSINESS_OWNER_TEL_3',
      SHRSH_POSITION: 'LSS_ATTORNEY_POST',
      SHRSH_FULL_NAME: 'LSS_ATTORNEY_FULL_NAME',
      SHRSH_NAME: 'LSS_ATTORNEY_POST_FULL_NAME',
      SHRSH_OWNER: 'S_BUSINESS_OWNER_POST_FULL_NAME',
      SHRSH_OWNER_POSITION: 'S_BUSINESS_OWNER_POST',
      SHRSH_OWNER_FULL_NAME: 'S_BUSINESS_OWNER_REPRESENT_FULL',
    },
    JGYNSH: {
      JGYNSH_POST: 'BUSINESS_OWNER_POSTAL_CODE',
      JGYNSH_AD1: 'BUSINESS_OWNER_ADDRESS_1',
      JGYNSH_AD2: 'BUSINESS_OWNER_ADDRESS_2',
      JGYNSH_OFFICE: 'BUSINESS_OWNER_NAME',
      JGYNSH_NAME: 'BUSINESS_OWNER_POST_FULL_NAME',
      JGYNSH_TEL: 'BUSINESS_OWNER_TEL',
      JGYNSH_POST1: 'BUSINESS_OWNER_POSTAL_CODE_1',
      JGYNSH_POST2: 'BUSINESS_OWNER_POSTAL_CODE_2',
      JGYNSH_POSITION: 'BUSINESS_OWNER_POST',
      JGYNSH_OWNER: 'BUSINESS_OWNER_REPRESENT_FULL_N',
      JGYNSH_TEL1: 'BUSINESS_OWNER_TEL_1',
      JGYNSH_TEL2: 'BUSINESS_OWNER_TEL_2',
      JGYNSH_TEL3: 'BUSINESS_OWNER_TEL_3',
    },
    OFF: {
      OFF_POST: 'OFFICE_POSTAL_CODE',
      OFF_AD1: 'OFFICE_ADDRESS_1',
      OFF_AD2: 'OFFICE_ADDRESS_2',
      OFF_NAME: 'OFFICE_NAME',
      OFF_TEL: 'OFFICE_TEL',
      OFF_POST1: 'OFFICE_POSTAL_CODE_1',
      OFF_POST2: 'OFFICE_POSTAL_CODE_2',
      OFF_TEL1: 'OFFICE_TEL_1',
      OFF_TEL2: 'OFFICE_TEL_2',
      OFF_TEL3: 'OFFICE_TEL_3',
    },
    TNTSH: {
      TNTSH_NAME: 'RESPONSIBLE_FULL_NAME',
      TNTSH_AFFILIATION: 'RESPONSIBLE_AFFILIATION',
      TNTSH_POSITION: 'RESPONSIBLE_POSITION',
      TNTSH_TEL: 'RESPONSIBLE_TEL',
      TNTSH_FAX: 'RESPONSIBLE_FAX',
      TNTSH_MAIL: 'RESPONSIBLE_MAIL_ADDRESS',
      TNTSH_TEL1: 'RESPONSIBLE_TEL_1',
      TNTSH_TEL2: 'RESPONSIBLE_TEL_2',
      TNTSH_TEL3: 'RESPONSIBLE_TEL_3',
      TNTSH_FAX1: 'RESPONSIBLE_FAX_1',
      TNTSH_FAX2: 'RESPONSIBLE_FAX_2',
      TNTSH_FAX3: 'RESPONSIBLE_FAX_3',
      TNTSH_MAIL1: 'RESPONSIBLE_MAIL_ADDRESS_1',
      TNTSH_MAIL2: 'RESPONSIBLE_MAIL_ADDRESS_2',
    },
  };

  static #notHaveObjPrefix = {
    EIFN: 'E_I_F_NO',
    LIN: 'LABOR_INSURANCE_NO',
    CN: 'CORPORATE_NUMBER',
    EIFN1: 'E_I_F_NO_1',
    EIFN2: 'E_I_F_NO_2',
    EIFN3: 'E_I_F_NO_3',
    LIN1: 'LABOR_INSURANCE_NO_1',
    LIN2: 'LABOR_INSURANCE_NO_2',
    LIN3: 'LABOR_INSURANCE_NO_3',
    CAPITAL_STOCK: 'CAPITAL',
    EMPLOYEEN: 'EMPLOYEE_NUMBER',
    PRINCIPAL_BIZ: 'PRINCIPAL_BUSINESS',
    SCALE: 'CORPORATE_SCALE',
    INDUSTRYCLASSL: 'INDUSTRY_CLASSIFICATION_DIVISIO',
    INDUSTRYCLASSM: 'INDUSTRY_CLASSIFICATION',
    INDUSTRIES_TYPE: 'INDUSTRIES',
    LABOR_DELEGATE: 'WORKING_REPRESENTATIVE_FULL_NAM',
    CUTOFFDATE: 'CUTOFF_DATE',
    PAYMENT_DATE: 'PAYMENT_DATE',
    JGYNSHBIRTHDAY: 'REPRESENTATIVE_BIRTHDAY',
    FOUNDATIONYEAR: 'FOUNDATION_YEAR',
    FINANCIALMONTH: 'FINANCIAL_MONTH',
    ROUDOUKYOKU: 'WORKING_AGENCY_HEAD_LOCAL',
    HELLOWORK: 'PUBLIC_EMPLOYMENT_SECURITY_OFFI',
    TENANT_ID: 'TENANT_ID',
    CREATED_TENANT_ID: 'CREATED_TENANT_ID',
    ROUKI_ID: 'LSIO_ID',
    IS_YUCHO: 'IS_USING_JP_BANK',
    BANK_NAME: 'F_I_NAME',
    BANK_CODE: 'F_I_CODE',
    BANK_BRANCH_NAME: 'F_I_BRANCH_NAME',
    BANK_BRANCH_CODE: 'F_I_BRANCH_CODE',
    BANK_NUM: 'ACCOUNT_NUMBER',
    BANK_TYPE: 'ACCOUNT_TYPE',
    BANK_HOLDER_KANJI: 'ACCOUNT_HOLDER_NAME_KANJI',
    BANK_HOLDER_KANA: 'ACCOUNT_HOLDER_NAME_KANA',
    YUCHO_SYMBOL: 'JP_POST_SYMBOL',
    YUCHO_NUM: 'JP_POST_NUMBER',
  };

  static #hasProcessedValue = {
    JGYNSHBIRTHDAY_Y: () => InputObjects.getValue('JGYNSHBIRTHDAY').slice(0, 4),
    JGYNSHBIRTHDAY_M: () => InputObjects.getValue('JGYNSHBIRTHDAY').slice(4, 6),
    JGYNSHBIRTHDAY_D: () => InputObjects.getValue('JGYNSHBIRTHDAY').slice(6, 8),
    SHRSH_NUM: () => InputObjects.getValue('LSS_ATTORNEY_REGIST_NUMBER') || InputObjects.getValue('S_LSS_ATTORNEY_REGIST_NUMBER'),
    ROUKI_NAME: () => InputObjects.getValue('LSIO').split('労働基準監督署')[0],
    BANK_TYPE: () => (InputObjects.getValue('IS_USING_JP_BANK') === '1' ? '' : InputObjects.getValue('F_I_TYPE')),
    BANK_CODE: () => (InputObjects.getValue('IS_USING_JP_BANK') === '1' ? '' : InputObjects.getValue('F_I_CODE')),
  };

  static #withHyphen = {
    JGYNSH_POST: '-',
    JGYNSH_TEL: '-',
    SHRSH_POST: '-',
    SHRSH_TEL: '-',
    OFF_POST: '-',
    OFF_TEL: '-',
    TNTSH_TEL: '-',
    TNTSH_FAX: '-',
    TNTSH_MAIL: '@',
    SHRSH_NAME: '　',
    SHRSH_OWNER: '　',
    JGYNSH_NAME: '　',
    EIFN: '--',
    LIN: '--',
  };

  static trimHyphen(name) {
    const value = InputObjects.getValue(CompanyMaster.toMasterName(name));
    return value === this.#withHyphen[name] ? '' : value;
  }

  static toMasterName(name) {
    const objPrefix = name.split('_')[0];
    if (!(this.#hasObjPrefix.hasOwnProperty(objPrefix))) return this.#notHaveObjPrefix[name];
    return this.#hasObjPrefix[objPrefix][name];
  }

  static getMaster(name) {
    if (this.#hasProcessedValue.hasOwnProperty(name)) return this.#hasProcessedValue[name];
    if (this.#withHyphen.hasOwnProperty(name)) return CompanyMaster.trimHyphen(name);
    return InputObjects.getValueByIndex(CompanyMaster.toMasterName(name));
  }

  static setMaster(name) {
    const value = CompanyMaster.getMaster(name);
    if (value === '') return;
    InputObjects.setValueByIndex(name, value);
  }

  static getAllObjNameByType(type) {
    return Object.keys(this.#hasObjPrefix[type]);
  }

  static setAllMasterByType(type) {
    CompanyMaster.getAllObjNameByType(type).forEach(name => {
      CompanyMaster.setMaster(name);
    });
  }

  static setAllMaster() {
    Object.keys(this.#hasObjPrefix).forEach(type => {
      if (type === 'SHRSH' && (getMaster('TENANT_ID') === getMaster('CREATED_TENANT_ID'))) return;
      CompanyMaster.setAllMasterByType(type);
    });
    Object.keys(this.#notHaveObjPrefix).forEach(name => {
      CompanyMaster.setMaster(name);
    });
    Object.keys(this.#hasProcessedValue).forEach(name => {
      CompanyMaster.setMaster(name);
    });
    LazyEvaluationFunctions.callCompanyMasterFunctions?.();
  }
}
