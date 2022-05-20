/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /**
   * admin/ auth
   */
  'POST /admin/auth/sendToken': 'Admin.AuthController.sendToken',
  'POST /admin/auth/login': 'Admin.AuthController.login',
  'POST /admin/auth/logout': 'Admin.AuthController.logout',

  /**
   * admin/make
   */
  'GET /admin/make': 'Admin.MakeController.getMake',
  'POST /admin/make/create': 'Admin.MakeController.createMake',
  'POST /admin/make/update': 'Admin.MakeController.updateMake',
  'POST /admin/make/delete': 'Admin.MakeController.deleteMake',

  /**
   * admin/model
   */
  'GET /admin/model': 'Admin.ModelController.getModel',
  'POST /admin/model/create': 'Admin.ModelController.createModel',
  'POST /admin/model/update': 'Admin.ModelController.updateModel',
  'POST /admin/model/delete': 'Admin.ModelController.deleteModel',
};
