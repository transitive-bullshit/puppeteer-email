'use strict'

const ow = require('ow')
const PuppeteerEmailProvider = require('puppeteer-email-provider')

/**
 * Holds state for an authenticated puppeteer email session.
 *
 * @param {object} opts - Options
 * @param {object} opts.user - Authenticated user
 * @param {string} opts.user.username - Authenticated user's username
 * @param {string} opts.user.email - Authenticated user's email
 * @param {object} opts.browser - Puppeteer Browser to use
 * @param {PuppeteerEmailProvider} opts.provider - Email provider to use
 */
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

  /**
   * Authenticated user's username.
   *
   * @member {string}
   */
  get username () { return this._opts.user.username }

  /**
   * Authenticated user's email.
   *
   * @member {string}
   */
  get email () { return this._opts.user.email }

  /**
   * Email provider to use.
   *
   * @member {PuppeteerEmailProvider}
   */
  get provider () { return this._opts.provider }

  /**
   * Puppeteer Browser to use.
   *
   * @member {string}
   */
  get browser () { return this._opts.browser }

  /**
   * Whether or not this session is currently authenticated with the given
   * email provider.
   *
   * @member {boolean}
   */
  get isAuthenticated () { return this._isAuthenticated }

  /**
   * Signs out of this session.
   *
   * @return {Promise}
   */
  async signout () {
    if (!this.isAuthenticated) {
      return
    }

    await this.provider.signout(this)
    this._isAuthenticated = false
  }

  /**
   * Sends an email from this session.
   *
   * @param {object} email - TODO
   * @param {object} [opts] - Options
   *
   * @return {Promise}
   */
  async sendEmail (email, opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" sendEmail not authenticated`)
    }

    return this.provider.sendEmail(this, email, opts)
  }

  /**
   * Fetches emails from the inbox of this session's account.
   *
   * @param {object} [opts] - Options
   * @param {object} [opts.query] - Search query to narrow down results
   *
   * @return {Promise<Array<Object>>}
   */
  async getEmails (opts) {
    if (!this.isAuthenticated) {
      throw new Error(`"${this.email}" getEmails not authenticated`)
    }

    return this.provider.getEmails(this, opts)
  }

  /**
   * Closes the underlying Puppeteer Browser instance, effectively ending this
   * session.
   *
   * @return {Promise}
   */
  async close () {
    return this.browser.close()
  }
}

module.exports = PuppeteerEmailSession
