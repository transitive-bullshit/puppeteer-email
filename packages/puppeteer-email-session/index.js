'use strict'

const ow = require('ow')
const PuppeteerEmailProvider = require('puppeteer-email-provider')

class PuppeteerEmailSession {
  constructor (opts) {
    ow(opts, ow.object.plain.nonEmpty)
    ow(opts.username, ow.string.nonEmpty)
    ow(opts.email, ow.string.nonEmpty)
    ow(opts.browser, ow.object)
    ow(opts.provider, ow.object.instanceOf(PuppeteerEmailProvider))

    this._opts = opts
    this._isAuthenticated = true
  }

  get username () { return this._opts.username }
  get email () { return this._opts.email }
  get isAuthenticated () { return this._isAuthenticated }

  signout () {
    return this._opts.provider.signout(this)
  }

  sendEmail (email, opts) {
    return this._opts.provider.sendEmail(this, email, opts)
  }

  getEmails (opts) {
    return this._opts.provider.getEmails(this, opts)
  }
}

module.exports = PuppeteerEmailSession
