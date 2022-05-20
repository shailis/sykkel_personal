/**
 * Customer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'customer',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'string',
      columnType: 'VARCHAR(40)',
      required: true,
      unique: true,
    },

    firstName: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
    },

    lastName: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
    },

    address: {
      type: 'string',
      columnType: 'VARCHAR(255)',
    },

    postCode: {
      type: 'string',
      columnType: 'VARCHAR(10)',
    },

    place: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    country: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    profilePhoto: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    email: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    phoneCountryCode: {
      type: 'string',
      columnType: 'VARCHAR(5)',
      required: true,
    },

    phone: {
      type: 'string',
      columnType: 'VARCHAR(128)',
      required: true,
    },

    birtDate: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    loginCode: {
      type: 'string',
      columnType: 'VARCHAR(128)',
    },

    authToken: {
      type: 'string',
      columnType: 'VARCHAR(255)',
    },

    isTncAgreed: {
      type: 'boolean',
      columnType: 'BOOLEAN',
      defaultsTo: false,
      required: true,
    },

    isVerified: {
      type: 'boolean',
      columnType: 'BOOLEAN',
      defaultsTo: false,
      required: true,
    },

    tncAgreedAt: {
      type: 'number',
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
   * @description validation hook on create or update of customer data
   * @author Shaili S. (Zignuts Technolab)
   * @param {Admin Model Data} customerData
   * @returns JSON Response
   */
  validateBeforeCreateOrUpdate: function (customerData, lang) {
    let CustomerRules = sails.config.constants.ValidationRules.customer;
    let checks = {};
    let key;

    for (let i = 0; i < Object.keys(customerData).length; i++) {
      key = Object.keys(customerData)[i];
      checks[key] = CustomerRules[key];
    }

    let Validator = sails.config.constants.Validator;
    Validator.useLang(lang);
    let validation = new Validator(customerData, checks);
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

    if (!customerData.phone.match(phoneRegex)) {
      validationResult['hasError'] = true;
      validationResult['errors'] = sails.config.getMessages(
        'customer.AuthInvalidPhone',
        lang
      );
    }

    return validationResult;
  },
};
