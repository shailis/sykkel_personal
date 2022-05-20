const jwt = require('jsonwebtoken');
const TokenExpiry = sails.config.constants.TokenExpiry;

module.exports = {
  friendlyName: 'Jwt sign',

  description: 'creates auth token for super admin',

  inputs: {
    data: {
      type: 'json',
    },
    key: {
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs) {
    // TODO
    let result = {};
    const { data, key } = inputs;

    const token = jwt.sign(
      {
        id: data.id,
        phone: data.phone,
      },
      key,
      {
        expiresIn: TokenExpiry,
      }
    );

    // if token not created
    if (!token) {
      result.hasError = true;
      result.token = '';
      return result;
    }

    // else store token in result and return
    result.hasError = false;
    result.token = token;
    return result;
  },
};
