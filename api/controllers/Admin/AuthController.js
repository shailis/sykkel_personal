/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } =
  sails.config.constants.ResponseCodes;
const { UUID, OTPGenerator, OTPRules, OTPLength } = sails.config.constants;
const getMessages = sails.config.getMessages;

module.exports = {
  /**
   * @function sendToken
   * @description Takes user phone number and sends OTP via SMS for login
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  sendToken: async (req, res) => {
    sails.log.info('In Admin AuthController sendToken function');

    try {
      const { name, phone } = req.body;
      const lang = req.getLocale();

      // validate phone and name
      let adminValidationResult = await Admin.validateBeforeCreateOrUpdate(
        { name, phone },
        lang
      );

      if (adminValidationResult.hasError) {
        sails.log.error(
          'sendToken admin validation error:',
          adminValidationResult
        );
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.AuthInvalidPhone', req.getLocale()),
        });
      }

      // generate otp
      const loginCode = OTPGenerator.generate(OTPLength, OTPRules);
      if (!loginCode) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.AuthOTPNotGenerated', lang),
        });
      }
      sails.log.info('OTP', loginCode, 'generated for phone number', phone);

      let admin;
      // check if admin already exists
      const adminExists = await Admin.findOne({ name, phone });
      if (adminExists) {
        // if admin exists, update loginCode
        admin = await Admin.updateOne({ id: adminExists.id }, { loginCode });
      } else {
        //else create admin
        admin = await Admin.create({
          id: UUID(),
          name,
          phone,
          loginCode,
        }).fetch();
      }
      // sails.log.info(admin);

      // for testing purposes only, sending OTP response for now
      // res.status(OK).json({
      //   statusCode: OK,
      //   data: admin,
      //   message: getMessages('admin.AuthOTPGenerated', lang),
      // });

      // send OTP message
    } catch (err) {
      sails.log.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        statusCode: INTERNAL_SERVER_ERROR,
        data: {},
        message: err.toString(),
      });
    }
  },

  /**
   * @function login
   * @description Verify OTP and login user
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  login: async (req, res) => {
    sails.log.info('In Admin AuthController login function');
    try {
      const { phone, loginCode } = req.body;
      const lang = req.getLocale();

      const admin = await Admin.findOne({ phone, loginCode });

      // if admin not found
      if (!admin) {
        return res.status(UNAUTHORIZED).json({
          statusCode: UNAUTHORIZED,
          data: {},
          message: getMessages('admin.AuthLoginDetailsIncorrect', lang),
        });
      }
      // sails.log.info('Created admin:', admin);

      // create auth token
      const key = process.env.JWT_SECRET_KEY;
      const authTokenCreationResult = await sails.helpers.jwtSign(
        { id: admin.id, phone },
        key
      );
      // sails.log.info('authToken creation result:', authTokenCreationResult);

      // error in creating token
      if (authTokenCreationResult.hasError) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.InternalServerError', req.getLocale()),
        });
      }

      // update authToken of admin
      const loggedInAdmin = await Admin.updateOne(
        { id: admin.id },
        {
          loginCode: '',
          authToken: authTokenCreationResult.token,
          isActive: true,
        }
      );

      if (!loggedInAdmin) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.InternalServerError', req.getLocale()),
        });
      }
      // sails.log.info(loggedInAdmin);

      res.status(OK).json({
        statusCode: OK,
        data: loggedInAdmin,
        message: getMessages('admin.AuthSuccessful', lang),
      });
    } catch (err) {
      sails.log.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        statusCode: INTERNAL_SERVER_ERROR,
        data: {},
        message: err.toString(),
      });
    }
  },

  /**
   * @function logout
   * @description Logout admin
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  logout: async (req, res) => {
    sails.log.info('In Admin AuthController logout function');
    try {
      const { me } = req;
      const lang = req.getLocale();
      // sails.log.info('Logged in admin:', me);

      // delete admin
      const loggedOutAdmin = await Admin.updateOne(
        { id: me.id },
        { authToken: '', isActive: false }
      );

      // if admin not logged out
      if (!loggedOutAdmin) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.LogoutError', lang),
        });
      }

      // else successful logout message
      res.status(OK).json({
        statusCode: OK,
        data: {},
        message: getMessages('admin.LogoutSuccessful', lang),
      });
    } catch (err) {
      sails.log.error(err);
      res.status(INTERNAL_SERVER_ERROR).json({
        statusCode: INTERNAL_SERVER_ERROR,
        data: {},
        message: err.toString(),
      });
    }
  },
};
