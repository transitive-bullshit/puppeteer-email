'use strict'

const ow = require('ow')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')

module.exports.providers = {
  'outlook': PuppeteerEmailProviderOutlook
}

module.exports.getProviderByName = (name, opts) => {
  ow(name, ow.string.nonEmpty)
  const Provider = module.exports.providers[name.toLowerCase()]

  if (!Provider) throw new Error(`unrecognized provider name "${name}"`)
  return new Provider(opts)
}

module.exports.getProviderByEmail = (email, opts) => {
  ow(email, ow.string.nonEmpty)

  let Provider
  if (/@outlook\.com/i.test(email)) {
    Provider = module.exports.providers.outlook
  }

  if (!Provider) throw new Error(`unrecognized provider email "${email}"`)
  return new Provider(opts)
}
