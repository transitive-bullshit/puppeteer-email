'use strict'

const ow = require('ow')

const PuppeteerEmailProvider = require('puppeteer-email-provider')
const PuppeteerEmailSession = require('puppeteer-email-session')

const signup = require('./lib/signup')
const signin = require('./lib/signin')
const signout = require('./lib/signout')
const sendEmail = require('./lib/send-email')
const getEmails = require('./lib/get-emails')

/**
 * Puppeteer email provider for [Yahoo](https://mail.yahoo.com).
 *
 * @extends PuppeteerEmailProvider
 */
class PuppeteerEmailProviderYahoo extends PuppeteerEmailProvider {
  /**
   * Email provider to automate.
   *
   * @member {PuppeteerEmailProvider}
   */
  get name () {
    return 'yahoo'
  }

  /**
   * Creates a new email account.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to create
   * @param {string} user.username - Username
   * @param {string} user.password - Password
   * @param {string} user.firstName - User's given name
   * @param {string} user.lastName - User's family name
   * @param {object} user.birthday - User's birthday
   * @param {string} user.birthday.month - User's birthday month
   * @param {string} user.birthday.day - User's birthday day
   * @param {string} user.birthday.year - User's birthday year
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<PuppeteerEmailSession>}
   */
  async signup (user, opts) {
    ow(user, ow.object.plain.nonEmpty.label('user'))
    ow(user.username, ow.string.nonEmpty.label('user.username'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))
    ow(opts, ow.object.nonEmpty.label('opts'))
    ow(opts.browser, ow.object.nonEmpty.label('browser'))

    await signup(user, opts)

    return new PuppeteerEmailSession({
      user: {
        username: user.username,
        email: `${user.username}@yahoo.com`
      },
      browser: opts.browser,
      provider: this
    })
  }

  /**
   * Signs into an existing email account.
   *
   * You must specify either `user.username` or `user.email`.
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} user - User info for the account to sign into
   * @param {string} [user.username] - Username (implies email)
   * @param {string} [user.email] - Email (implies username)
   * @param {string} user.password - Password
   *
   * @param {object} opts - Options
   * @param {Object} opts.browser - Puppeteer browser instance to use
   *
   * @return {Promise<PuppeteerEmailSession>}
   */
  async signin (user, opts) {
    ow(user, ow.object.plain.nonEmpty.label('user'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))

    if (user.username) {
      ow(user.username, ow.string.nonEmpty)
    } else if (user.email) {
      ow(user.email, ow.string.nonEmpty)
    } else {
      throw new Error('missing required parameter "username" or "email"')
    }

    ow(opts, ow.object.nonEmpty)
    ow(opts.browser, ow.object.nonEmpty)

    user.email = user.email || `${user.username}@yahoo.com`

    await signin(user, opts)

    return new PuppeteerEmailSession({
      user: {
        username: user.username,
        email: user.email
      },
      browser: opts.browser,
      provider: this
    })
  }

  /**
   * Signs out of an authenticated session.
   *
   * @param {PuppeteerEmailSession} session
   *
   * @return {Promise}
   */
  async signout (session) {
    ow(session, ow.object.instanceOf(PuppeteerEmailSession))

    return signout({
      browser: session.browser
    })
  }

  /**
   * Sends an email from an authenticated session.
   *
   * @param {PuppeteerEmailSession} session
   * @param {object} email - TODO
   * @param {object} [opts] - Options
   *
   * @return {Promise}
   */
  async sendEmail (session, email, opts = { }) {
    ow(session, ow.object.instanceOf(PuppeteerEmailSession))
    ow(email, ow.object)
    ow(opts, ow.object.plain)

    return sendEmail(email, {
      browser: session.browser,
      ...opts
    })
  }

  /**
   * Fetches emails from the inbox of an authenticated session.
   *
   * @param {PuppeteerEmailSession} session
   * @param {object} [opts] - Options
   * @param {object} [opts.query] - Search query to narrow down results
   *
   * @return {Promise<Array<Object>>}
   */
  async getEmails (session, opts = { }) {
    ow(session, ow.object.instanceOf(PuppeteerEmailSession))
    ow(opts, ow.object.plain)

    return getEmails({
      browser: session.browser,
      ...opts
    })
  }
}

module.exports = PuppeteerEmailProviderYahoo
