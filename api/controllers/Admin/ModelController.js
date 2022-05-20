/**
 * ModelController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { NOT_FOUND, OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } =
  sails.config.constants.ResponseCodes;
const getMessages = sails.config.getMessages;
const { UUID } = sails.config.constants;

module.exports = {
  /**
   * @function getModel
   * @description Gets all model items
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  getModel: async (req, res) => {
    sails.log.info('In Admin MakeController getModel function');
    try {
      const lang = req.getLocale();

      // get query params
      const page = req.query.page || 1;
      const perPage = req.query.perPage || 20;
      // const name = req.query.name || '';
      // const makeCode = req.query.makeCode || '';
      const { name, makeCode } = req.query;

      // create search params condition
      let condition = {};
      if (name) {
        condition.name = name;
      }

      if (makeCode) {
        condition.make_code = makeCode;
      }

      // find models with search and pagination
      const models = await Model.find({
        where: condition,
        skip: perPage * page - perPage,
        limit: perPage,
      });

      // get total count of records with given search params
      const count = await Model.count(condition);

      // if models not found, return not found message
      if (!models) {
        return res.status(NOT_FOUND).json({
          statusCode: NOT_FOUND,
          data: {},
          message: getMessages('admin.ModelNotFound', lang),
        });
      }

      // esle data with success message
      res.status(OK).json({
        statusCode: OK,
        data: { modelList: models, count },
        message: getMessages('admin.ModelFound', lang),
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
   * @function createModel
   * @description Creates model item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  createModel: async (req, res) => {
    sails.log.info('In Admin MakeController createModel function');
    try {
      const lang = req.getLocale();
      const { name, makeCode } = req.body;

      // check if the makeCode exists or not
      const makeExists = await Make.findOne({ id: makeCode });
      if (!makeExists) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.ModelInvalidCode', lang),
        });
      }

      // check if a model with this name already exists
      const modelExists = await Model.findOne({ name });
      if (modelExists) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.ModelDuplicateName', lang),
        });
      }

      const modelValidationResult = await Model.validateBeforeCreateOrUpdate(
        {
          name,
          // eslint-disable-next-line camelcase
          make_code: makeCode,
        },
        lang
      );

      // validation fails
      if (modelValidationResult.hasError) {
        sails.log('Model create validation error:', modelValidationResult);
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.ModelDetailsIncorrect', req.getLocale()),
        });
      }

      // create new model
      const model = await Model.create({
        id: UUID(),
        name,
        // eslint-disable-next-line camelcase
        make_code: makeExists.id,
      }).fetch();

      // if not created, return error message
      if (!model) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          statusCode: INTERNAL_SERVER_ERROR,
          data: {},
          message: getMessages('admin.ModelCreateError', lang),
        });
      }

      // else return data with success message
      res.status(OK).json({
        statusCode: OK,
        data: model,
        message: getMessages('admin.ModelSuccessful', lang),
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
   * @function updateModel
   * @description Updates model item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  updateModel: async (req, res) => {
    sails.log.info('In Admin MakeController updateModel function');
    try {
      const lang = req.getLocale();
      const { id, name, makeCode } = req.body;

      let updateParams = {};
      let makeExists;
      if (name) {
        updateParams.name = name;
      }
      if (makeCode) {
        makeExists = await Make.findOne({ id: makeCode });
        // if no suck makeCode found, return error
        if (!makeExists) {
          return res.status(BAD_REQUEST).json({
            statusCode: BAD_REQUEST,
            data: {},
            message: getMessages('admin.ModelUpdateMakeDoesNotExist', lang),
          });
        }
        // else update params
        // eslint-disable-next-line camelcase
        updateParams.make_code = makeExists.id;
      }

      const updatedModel = await Model.updateOne({ id }, updateParams);
      // if model not updated, return error message
      if (!updatedModel) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.ModelDoesNotExist', lang),
        });
      }

      // else return data with success message
      res.status(OK).json({
        statusCode: OK,
        data: updatedModel,
        message: getMessages('admin.ModelUpdateSuccessful', lang),
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
   * @function deleteModel
   * @description Deletes model item
   * @author Shaili S. (Zignuts Technolab)
   * @param {Request} req
   * @param {Response} res
   * @module Admin
   * @returns JSON Response
   */
  deleteModel: async (req, res) => {
    sails.log.info('In Admin MakeController deleteModel function');
    try {
      const lang = req.getLocale();

      const { id } = req.body;

      const deletedModel = await Model.destroyOne({ id });
      // if model does not exist or not deleted, send error message
      if (deletedModel === undefined || !deletedModel) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          data: {},
          message: getMessages('admin.ModelDoesNotExist', lang),
        });
      }

      // if deleted successfully, send success message
      res.status(OK).json({
        statusCode: OK,
        data: deletedMake,
        message: getMessages('admin.ModelDeleteSuccessful', lang),
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
