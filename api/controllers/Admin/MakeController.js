/**
 * MakeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST } =
  sails.config.constants.ResponseCodes;
const getMessages = sails.config.getMessages;

module.exports = {
  /**
   * @function getMake
   * @description Gets all make items
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  getMake: async (req, res) => {
    sails.log.info('In Admin MakeController getMake function');
    try {
      const lang = req.getLocale();

      // get query params
      const page = req.query.page || 1;
      const perPage = req.query.perPage || 20;
      const { name, code } = req.query;

      // create search params condition
      let condition = {};
      if (name) {
        condition.name = name;
      }
      if (code) {
        condition.code = code;
      }

      // find makes with search and pagination
      const makes = await Make.find({
        where: condition,
        skip: perPage * page - perPage,
        limit: perPage,
      });

      const count = await Make.count(condition);

      // if makes not found
      if (!makes) {
        return res.status(NOT_FOUND).json({
          statusCode: NOT_FOUND,
          data: {},
          message: getMessages('admin.MakeNotFound', lang),
        });
      }

      // else return data with success message
      res.status(OK).json({
        statusCode: OK,
        data: { makeList: makes, count },
        message: getMessages('admin.MakeFound', lang),
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
   * @function createMake
   * @description Creates make item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  createMake: async (req, res) => {
    sails.log.info('In Admin MakeController createMake function');
    try {
      const lang = req.getLocale();

      // get params
      const name = req.body.name;
      const code = req.body.code.toUpperCase();

      let make;
      // find if make with provided already exists
      make = await Make.findOne({ id: code });
      // if it exists, return error message
      if (make) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.DuplicateMake', lang),
        });
      }

      // else validate make fields
      const makeValidationResult = await Make.validateBeforeCreateOrUpdate(
        {
          name,
          code,
        },
        lang
      );

      // if validation fails, return error message
      if (makeValidationResult.hasError) {
        sails.log('Make create validation error:', makeValidationResult);
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.MakeInvalidDetails', req.getLocale()),
        });
      }

      // else create make
      make = await Make.create({
        id: code,
        name,
      }).fetch();

      // if make not created, return error message
      if (!make) {
        res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.InternalServerError', lang),
        });
      }

      // else return data with success message
      res.status(OK).json({
        statusCode: OK,
        data: make,
        message: getMessages('admin.MakeSuccessful', lang),
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
   * @function updateMake
   * @description Updates make item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  updateMake: async (req, res) => {
    sails.log.info('In Admin MakeController updateMake function');
    try {
      const lang = req.getLocale();
      const { code, newCode, newName } = req.body;

      // create update params condition
      let updateParams = {};
      let updatedMake;
      if (newCode) {
        // check if a make with code as newCode already exists
        updatedMake = await Make.findOne({ id: newCode });
        // if it exists return error
        if (updatedMake) {
          return res.status(BAD_REQUEST).json({
            statusCode: BAD_REQUEST,
            data: {},
            message: getMessages('admin.MakeUpdateDuplicateCode', lang),
          });
        }
        updateParams.id = newCode.toUpperCase();
      }
      if (newName) {
        updateParams.name = newName;
      }

      let validateParams = {};
      if (updateParams.id) {
        validateParams.code = updateParams.id;
      }
      if (updateParams.name) {
        validateParams.name = updateParams.name;
      }
      // validate make fields before updating
      const makeValidationResult = await Make.validateBeforeCreateOrUpdate(
        validateParams,
        lang
      );
      sails.log(makeValidationResult);
      // if error in validation
      if (makeValidationResult.hasError) {
        sails.log('Make update validation error:', makeValidationResult);
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.MakeInvalidDetails', req.getLocale()),
        });
      }

      // else update make
      updatedMake = await Make.updateOne({ id: code }, updateParams);

      // if error in updating make, return error message
      if (!updatedMake) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.InternalServerError', lang),
        });
      }
      // sails.log(updatedMake);

      // else return data with success message
      res.status(OK).json({
        statusCode: OK,
        data: updatedMake,
        message: getMessages('admin.MakeUpdateSuccessful', lang),
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
   * @function deleteMake
   * @description Deletes make item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  deleteMake: async (req, res) => {
    sails.log.info('In Admin MakeController deleteMake function');
    try {
      const lang = req.getLocale();
      const code = req.body.code.toUpperCase();

      const deletedMake = await Make.destroyOne({ id: code });
      // if code does not exist, send error message
      if (!deletedMake) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.MakeDeleteError', lang),
        });
      }

      // if deleted successfully, send success message
      res.status(OK).json({
        statusCode: OK,
        data: deletedMake,
        message: getMessages('admin.MakeDeleteSuccessful', lang),
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
