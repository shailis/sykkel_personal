/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'admin',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      columnType: 'VARCHAR(40)',
      required: true,
      unique: true,
    },

    name: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
    },

    email: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      isEmail: true,
    },

    phone: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
    },

    loginCode: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    authToken: {
      type: 'string',
      columnType: 'VARCHAR(255)',
    },
  },

  /**
   * @function customToJSON
   * @description send only necessary columns in response and omit others
   * @author Shaili S. (Zignuts Technolab)
   * @returns JSON Response
   */
  customToJSON: function () {
    // returns a shallow copy
    return _.omit(this, ['loginCode', 'deletedAt', 'deletedBy', 'isDeleted']);
  },

  /**
   * @function validateBeforeCreateOrUpdate
   * @description validation hook on create or update of admin data
   * @author Shaili S. (Zignuts Technolab)
   * @param {Admin Model Data} adminData
   * @returns JSON Response
   */
  validateBeforeCreateOrUpdate: function (adminData, lang) {
    let AdminRules = sails.config.constants.ValidationRules.admin;
    let checks = {};
    let key;

    for (let i = 0; i < Object.keys(adminData).length; i++) {
      key = Object.keys(adminData)[i];
      checks[key] = AdminRules[key];
    }

    let Validator = sails.config.constants.Validator;
    Validator.useLang(lang);
    let validation = new Validator(adminData, checks);
    let validationResult = {};

    // if validation passes
    if (validation.passes()) {
      validationResult['hasError'] = false;
      validationResult['errors'] = {};
    }

    // if validation fails
    if (validation.fails()) {
      validationResult['hasError'] = true;
      validationResult['errors'] = validation.errors.all();
    }

    let phoneRegex = sails.config.constants.PhoneRegex;

    if (!adminData.phone.match(phoneRegex)) {
      validationResult['hasError'] = true;
      validationResult['errors'] = sails.config.getMessages(
        'admin.AuthInvalidPhone',
        lang
      );
    }

    return validationResult;
  },
};
