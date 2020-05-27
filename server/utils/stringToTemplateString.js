const interpolate = (params, template) => {
  const names = Object.keys(params);
  const values = Object.values(params);
  // eslint-disable-next-line no-new-func
  return new Function(...names, `return \`${template}\`;`)(...values);
};

module.exports = {
  interpolate,
};
