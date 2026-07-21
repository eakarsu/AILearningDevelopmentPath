'use strict';
const { createRouter } = require('./router');
const { sequelize: adapt } = require('./store');
const { sequelize } = require('../models');
const auth = require('../middleware/auth');
const { evaluate } = require('./domain');
module.exports = createRouter({ db: adapt(sequelize), auth, evaluate,
  workflow: 'learning-development-path',
  providers: ['lms','hris','ats','calendar','content-catalog','communications'],
  approverRoles: ['learner','manager','instructor','privacy_officer','admin'] });

