'use strict'

const { test } = require('ava')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')

const factory = require('.')

test('outlook', (t) => {
  t.is(factory.providers.outlook, PuppeteerEmailProviderOutlook)
  t.true(factory.getProviderByName('outlook') instanceof PuppeteerEmailProviderOutlook)
  t.true(factory.getProviderByEmail('test1234n@outlook.com') instanceof PuppeteerEmailProviderOutlook)
})

test('unrecognized provider', (t) => {
  try {
    factory.getProviderByName('nala')
    t.fail('provider should throw')
  } catch (err) {
    t.pass()
  }
})
