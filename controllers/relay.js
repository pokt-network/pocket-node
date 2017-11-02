'use strict';

module.exports.add = async function(ctx, next) {
  ctx.body = {};
  await next();
};
