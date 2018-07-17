'use strict'

const { test } = require('ava')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')
const PuppeteerEmailProviderYahoo = require('puppeteer-email-provider-yahoo')

const factory = require('./providers')

test('outlook', (t) => {
  t.is(factory.providers.outlook, PuppeteerEmailProviderOutlook)
  t.true(factory.getProviderByName('outlook') instanceof PuppeteerEmailProviderOutlook)
  t.true(factory.getProviderByEmail('test1234n@outlook.com') instanceof PuppeteerEmailProviderOutlook)
})

test('yahoo', (t) => {
  t.is(factory.providers.yahoo, PuppeteerEmailProviderYahoo)
  t.true(factory.getProviderByName('yahoo') instanceof PuppeteerEmailProviderYahoo)
  t.true(factory.getProviderByEmail('test1234n@yahoo.com') instanceof PuppeteerEmailProviderYahoo)
})

test('unrecognized provider', (t) => {
  try {
    factory.getProviderByName('nala')
    t.fail('provider should throw')
  } catch (err) {
    t.pass()
  }
})
