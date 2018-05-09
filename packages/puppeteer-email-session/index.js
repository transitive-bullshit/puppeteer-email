'use strict'

const ow = require('ow')
const PuppeteerEmailProvider = require('puppeteer-email-provider')

class PuppeteerEmailSession {
  constructor (opts) {
    ow(opts, ow.object.plain.nonEmpty)
    ow(opts.user, ow.object.plain.nonEmpty)
    ow(opts.user.username, ow.string.nonEmpty)
    ow(opts.user.email, ow.string.nonEmpty)
    ow(opts.browser, ow.object)
    ow(opts.provider, ow.object.instanceOf(PuppeteerEmailProvider))

    this._opts = opts
    this._isAuthenticated = true
  }

  get username () { return this._opts.user.username }
  get email () { return this._opts.user.email }

  get provider () { return this._opts.provider }
  get browser () { return this._opts.browser }

  get isAuthenticated () { return this._isAuthenticated }

  async signout () {
    if (!this.isAuthenticated) {
      return
    }

    await this._opts.provider.signout(this)
    this._isAuthenticated = false
  }

  async sendEmail (email, opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" sendEmail not authenticated`)
    }

    return this._opts.provider.sendEmail(this, email, opts)
  }

  async getEmails (opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" getEmails not authenticated`)
    }

    return this._opts.provider.getEmails(this, opts)
  }
}

module.exports = PuppeteerEmailSession
