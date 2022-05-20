/**
 * Make.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'make_mst',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      columnType: 'VARCHAR(5)',
      columnName: 'code',
      required: true,
      unique: true,
    },

    name: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
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
    return _.omit(this, [
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
      'deletedBy',
    ]);
  },

  /**
   * @function validateBeforeCreateOrUpdate
   * @description validation hook on create or update of make data
   * @author Shaili S. (Zignuts Technolab)
   * @param {Admin Model Data} makeData
   * @returns JSON Response
   */
  validateBeforeCreateOrUpdate: function (makeData, lang) {
    let MakeRules = sails.config.constants.ValidationRules.make;
    let checks = {};
    let key;

    // sails.log('val', Object.keys(makeData).length);

    for (let i = 0; i < Object.keys(makeData).length; i++) {
      key = Object.keys(makeData)[i];
      sails.log('key', key);

      checks[key] = MakeRules[key];
      sails.log('check:', checks);
    }

    let Validator = sails.config.constants.Validator;
    Validator.useLang(lang);
    let validation = new Validator(makeData, checks);
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

    return validationResult;
  },
};
