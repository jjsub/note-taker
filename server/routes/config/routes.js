'use strict';

module.exports = [
  {method: 'get',    path: '/{param*}',                     config: require('../definitions/general/static')},
  {method: 'post',   path: '/register',                     config: require('../definitions/users/register')},
  {method: 'post',   path: '/login',                        config: require('../definitions/users/post_login')}
];
