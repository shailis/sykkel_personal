/**
 * Model.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'model_mst',
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

    make_code: {
      model: 'Make',
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
   * @description validation hook on create or update of model data
   * @author Shaili S. (Zignuts Technolab)
   * @param {Admin Model Data} modelData
   * @param {Language Code} lang
   * @returns
   */
  validateBeforeCreateOrUpdate: function (modelData, lang) {
    let ModelRules = sails.config.constants.ValidationRules.model;
    let checks = {};
    let key;

    for (let i = 0; i < Object.keys(modelData).length; i++) {
      key = Object.keys(modelData)[i];
      checks[key] = ModelRules[key];
    }

    let Validator = sails.config.constants.Validator;
    Validator.useLang(lang);
    let validation = new Validator(modelData, checks);
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
