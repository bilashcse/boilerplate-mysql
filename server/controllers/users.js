const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');

const { log } = require('../logger');
const {
  getAllUsers,
  createUser,
  updateUser,
} = require('../services/user/user');

const router = express.Router();
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// const PHONE_VALIDATE_REGX = '/^(+880|880|0)1(1|[3-9])[0-9]{8}$/';

module.exports = (app) => {
  app.use('/v1/user', router);
};

router.get('/', async (req, res) => {
  const { role, name, phone } = req.query;
  try {
    const users = await getAllUsers({ role, name, phone });
    res.status(200).json({
      isError: false,
      users,
    });
  } catch (err) {
    log.error(err.message);
    res.status(400).json({
      isError: true,
      message: err.message,
    });
  }
});

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      NAME: Joi.string().required(),
      PHONE: Joi.string().required(), // todo:  pattern validation needed
      ROLE: Joi.string()
        .valid('owner', 'employee')
        .required(),
    }),
  }),
  async (req, res) => {
    try {
      const { body } = req;
      await createUser(body);
      res.status(200).json({
        isError: false,
      });
    } catch (err) {
      log.error(err.message);
      res.status(400).json({
        isError: true,
        message: err.message,
      });
    }
  },
);

router.put(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.number().required(),
    }),
    body: Joi.object().keys({
      NAME: Joi.string().optional(),
      PHONE: Joi.string().optional(), // todo: patern validation
      ROLE: Joi.string()
        .valid('owner', 'employee')
        .optional(),
    }),
  }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { body } = req;
      await updateUser(body, userId);
      res.json({
        isError: false,
      });
    } catch (err) {
      log.error(err.message);
      res.status(400).json({
        isError: true,
        message: err.message,
      });
    }
  },
);
