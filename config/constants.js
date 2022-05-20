require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
// const { randomUUID } = require('crypto');

// response codes
const ResponseCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const Validator = require('validatorjs');
// validator conditions
const ValidationRules = {
  admin: {
    id: 'string|max:40|required',
    name: 'string|max:128|required',
    email: 'email|max:128',
    phone: 'string|max:128|required',
    loginCode: 'string|max:128',
    authToken: 'string|max:255',
    isActive: 'boolean|required',
  },

  make: {
    code: 'string|max:5|required',
    name: 'string|max:128|required',
    isActive: 'boolean|required',
  },

  model: {
    id: 'string|max:40|required',
    name: 'string|max:128|required',
    // eslint-disable-next-line camelcase
    make_code: 'string|max:5|required',
  },

  customer: {
    id: 'string|max:40|required',
    firstName: 'string|max:128|required',
    lastName: 'string|max:128|required',
    address: 'string|max:255',
    postCode: 'string|max:10',
    place: 'string|max:128',
    country: 'string|max:128',
    profilePhoto: 'string|max:128',
    email: 'string|max:128',
    phoneCountryCode: 'string|max:5|required',
    phone: 'string|max:128|required',
    birthDate: 'string|max:128',
    loginCode: 'string|max:128',
    authToken: 'string|max:255',
    isTncAgreed: 'boolean|required',
    isTncAgreed: 'boolean|required',
    tncAgreedAt: 'digits:11',
  },
};

const nodemailer = require('nodemailer');
// SMTP using nodemailer
let SMTPTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PWD,
  },
});

// Roles
const Roles = {
  superAdmin: { code: 'superAdmin' },
  showroom: { code: 'showroom' },
  mechanic: { code: 'mechanic' },
  user: { code: 'user' },
};

// jwt token expiry time as 7 days = 168h
const TokenExpiry = '7d';

// phone regular expression
const PhoneRegex = /([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}/g;

const OTPGenerator = require('otp-generator');
// otp generator rules
const OTPRules = {
  // digits: true, is dafault and so will generate only 6 digit OTP
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
};

const OTPLength = 6; // -> 6 digit

module.exports.constants = {
  UUID: uuidv4,
  ResponseCodes,
  Validator,
  ValidationRules,
  SMTPTransport,
  Roles,
  TokenExpiry,
  PhoneRegex,
  OTPGenerator,
  OTPRules,
  OTPLength,
};
