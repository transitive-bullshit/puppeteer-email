'use strict'

const ow = require('ow')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')
const PuppeteerEmailProviderYahoo = require('puppeteer-email-provider-yahoo')

exports.providers = {
  'outlook': PuppeteerEmailProviderOutlook,
  'yahoo': PuppeteerEmailProviderYahoo
}

exports.getProviderByName = (name, opts) => {
  ow(name, ow.string.nonEmpty)
  const Provider = module.exports.providers[name.toLowerCase()]

  if (!Provider) throw new Error(`unrecognized provider name "${name}"`)
  return new Provider(opts)
}

exports.getProviderByEmail = (email, opts) => {
  ow(email, ow.string.nonEmpty)

  let Provider
  if (/@outlook\.com/i.test(email)) {
    Provider = module.exports.providers.outlook
  } else if (/@yahoo\.com/i.test(email)) {
    Provider = module.exports.providers.yahoo
  }

  if (!Provider) throw new Error(`unrecognized provider email "${email}"`)
  return new Provider(opts)
}
