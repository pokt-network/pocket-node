'use strict';

// @TODO return the node information
module.exports.index = async function(ctx, next) {
  ctx.body = {};
  await next();
};
