/* eslint-disable no-param-reassign */
const parseError = (error) => error.details.map((i) => {
    const err = {
      key: i.context.key,
      path: i.path.join('.'),
      message: i.message.replace(/"/g, ''),
      type: i.type.split('.').shift(),
      constraint: i.type.split('.').pop(),
    };

    // if label is different than key, provide label
    if (i.context.label !== err.key) {
      err.label = i.context.label;
    }

    return err;
  });

const formatResponse = (error, source, errorMessage, errors) => {
  if (!error.output) {
    error.output = {};
  }

  if (!error.output.payload) {
    error.output.payload = {};
  }

  error.output.payload.message = errorMessage;
  error.output.payload.validation = {
    source,
    errors,
  };

  return error;
};

module.exports = {
  parseError,
  formatResponse,
};
