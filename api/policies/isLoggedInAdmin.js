const { FORBIDDEN, BAD_REQUEST } = sails.config.constants.ResponseCodes;
const getMessages = sails.config.getMessages;
const jwt = require('jsonwebtoken');

module.exports = async (req, res, proceed) => {
  // get authToken from the headers
  let authToken = req.headers['authorization'];
  const lang = req.getLocale();

  // check if there is authorization header and if authToken starts with Bearer
  if (authToken && authToken.startsWith('Bearer ')) {
    authToken = authToken.substring(7, authToken.length);
  } else {
    return res.status(FORBIDDEN).json({
      statusCode: FORBIDDEN,
      message: getMessages('admin.UnauthRequest', lang),
    });
  }

  // sails.log('current admin token', authToken);
  // verify token
  jwt.verify(
    authToken,
    process.env.JWT_SECRET_KEY,
    async (err, decodedToken) => {
      if (err) {
        return res.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          message: getMessages('admin.WrongToken', lang),
        });
      }
      // sails.log(decodedToken);

      // find admin with the decoded phone and otp
      const me = await Admin.findOne({
        id: decodedToken.id,
        phone: decodedToken.phone,
      });

      // sails.log('current admin', me);

      // if admin not found
      if (!me) {
        return res.status(FORBIDDEN).json({
          statusCode: FORBIDDEN,
          message: getMessages('admin.UnauthRequest', lang),
        });
      }

      // else store admin in req and proceed to next request
      req.me = me;
      return proceed();
    }
  );
};
