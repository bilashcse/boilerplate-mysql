const resolveDateRange = (since, until) => {
  if (since && until) {
    const from = new Date(/^\d+$/.test(since) ? parseInt(since, 10) : since);
    const to = new Date(/^\d+$/.test(until) ? parseInt(until, 10) : until);

    return { from, to };
  }

  return { from: null, to: null };
};

module.exports = {
  resolveDateRange,
};
