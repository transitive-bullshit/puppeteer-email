'use strict'

const ow = require('ow')

const PuppeteerEmailProvider = require('puppeteer-email-provider')

class PuppeteerEmail {
  constructor (provider) {
    ow(provider, ow.object.instanceOf(PuppeteerEmailProvider))

    this._provider = provider
  }

  get provider () { return this._provider }

  async signup (user, opts = { }) {
    return this._provider.signup(user, opts)
  }

  async signin (user, opts = { }) {
    return this._provider.signin(user, opts)
  }
}

module.exports = PuppeteerEmail
