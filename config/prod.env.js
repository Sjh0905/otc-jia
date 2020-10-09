'use strict'
module.exports = {
  NODE_ENV: '"production"',
  DOMAIN: process.env.DOMAIN ? JSON.stringify(process.env.DOMAIN) : "''",
  GOTOCONTRACT: process.env.GOTOCONTRACT ? JSON.stringify(process.env.GOTOCONTRACT) : "''",
}
