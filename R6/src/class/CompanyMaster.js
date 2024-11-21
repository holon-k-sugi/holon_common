class CompanyMaster {
  static initialize() {
    const hasObjPrefix = {
      SHRSH: {
        masterPrefix: 'S_BUSINESS_OWNER_',
        hasMasterPrefix: {
          POST: 'POSTAL_CODE',
          AD1: 'ADDRESS_1',
          AD2: 'ADDRESS_2',
          OFFICE: 'NAME',
          TEL: 'TEL',
          POST1: 'POSTAL_CODE_1',
          POST2: 'POSTAL_CODE_2',
          TEL1: 'TEL_1',
          TEL2: 'TEL_2',
          TEL3: 'TEL_3',
        },
        noMasterPrefix: {
          POSITION: 'LSS_ATTORNEY_POST',
          OWNER: 'LSS_ATTORNEY_FULL_NAME',
          NUM: 'SHRSH_NUM',
        },
      },
      JGYNSH: {
        masterPrefix: 'BUSINESS_OWNER_',
        hasMasterPrefix: {
          POST: 'POSTAL_CODE',
          AD1: 'ADDRESS_1',
          AD2: 'ADDRESS_2',
          OFFICE: 'NAME',
          NAME: 'POST_FULL_NAME',
          TEL: 'TEL',
          POST1: 'POSTAL_CODE_1',
          POST2: 'POSTAL_CODE_2',
          POSITION: 'POST',
          OWNER: 'REPRESENT_FULL_N',
          TEL1: 'TEL_1',
          TEL2: 'TEL_2',
          TEL3: 'TEL_3',
        },
        noMasterPrefix: {},
      },
      OFF: {
        masterPrefix: 'OFFICE_',
        hasMasterPrefix: {
          POST: 'POSTAL_CODE',
          AD1: 'ADDRESS_1',
          AD2: 'ADDRESS_2',
          NAME: 'NAME',
          TEL: 'TEL',
          POST1: 'POSTAL_CODE_1',
          POST2: 'POSTAL_CODE_2',
          TEL1: 'TEL_1',
          TEL2: 'TEL_2',
          TEL3: 'TEL_3',
        },
        noMasterPrefix: {},
      },
      TNTSH: {
        masterPrefix: 'RESPONSIBLE_',
        hasMasterPrefix: {
          NAME: 'FULL_NAME',
          AFFILIATION: 'AFFILIATION',
          TEL: 'TEL',
          FAX: 'FAX',
          MAIL: 'MAIL_ADDRESS',
          TEL1: 'TEL_1',
          TEL2: 'TEL_2',
          TEL3: 'TEL_3',
          FAX1: 'FAX_1',
          FAX2: 'FAX_2',
          FAX3: 'FAX_3',
          MAIL1: 'MAIL_ADDRESS_1',
          MAIL2: 'MAIL_ADDRESS_2',
        },
        noMasterPrefix: {},
      },
    };
    Object.keys(hasObjPrefix).forEach(type => {
      this[type] = {};
      const tmp = hasObjPrefix[type];
      Object.keys(tmp.hasMasterPrefix).forEach(objSuffix => {
        this[type][objSuffix] = tmp.masterPrefix + tmp.hasMasterPrefix[objSuffix];
      });
      Object.keys(tmp.noMasterPrefix).forEach(objSuffix => {
        this[type][objSuffix] = tmp.noMasterPrefix[objSuffix];
      });
    });
    this.OTHER = {
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
      JGYNSHBIRTHDAY: 'REPRESENTATIVE_BIRTHDAY',
      FOUNDATIONYEAR: 'FOUNDATION_YEAR',
      FINANCIALMONTH: 'FINANCIAL_MONTH',
      ROUDOUKYOKU: 'WORKING_AGENCY_HEAD_LOCAL',
      HELLOWORK: 'PUBLIC_EMPLOYMENT_SECURITY_OFFI',
      JGYNSHBIRTHDAY_Y: 'JGYNSHBIRTHDAY_Y',
      JGYNSHBIRTHDAY_M: 'JGYNSHBIRTHDAY_M',
      JGYNSHBIRTHDAY_D: 'JGYNSHBIRTHDAY_D',
      TENANT_ID: 'TENANT_ID',
      CREATED_TENANT_ID: 'CREATED_TENANT_ID',
      ROUKI_ID: 'LSIO_ID',
      ROUKI_NAME: 'LSIO',
    };
  }

  static toMasterName(name) {
    const splitName = name.split('_');
    if (!(splitName[0] in this)) return this.OTHER[name];
    const objPrefix = splitName.shift();
    const objSuffix = splitName.join('_');
    return this[objPrefix][objSuffix];
  }

  static getMaster(name) {
    if (!InputObjects.objExists(CompanyMaster.toMasterName(name))) {
      console.warn(`${CompanyMaster.toMasterName(name)}は存在しないオブジェクト`);
      return '';
    }
    return getV(CompanyMaster.toMasterName(name));
  }

  static setMaster(name) {
    const exists = [name, CompanyMaster.toMasterName(name)].filter(v => !InputObjects.objExists(v));
    if (exists.length > 0) {
      exists.forEach(v => console.warn(`${v}は存在しないオブジェクト`));
      return;
    }
    setV(name, CompanyMaster.getMaster(name));
  }

  static getAllObjNameByType(type) {
    return Object.keys(this[type]).map(key => `${type === 'OTHER' ? '' : `${type}_`}${key}`);
  }

  static setAllMasterByType(type) {
    CompanyMaster.getAllObjNameByType(type).forEach(name => {
      CompanyMaster.setMaster(name);
    });
  }
}
