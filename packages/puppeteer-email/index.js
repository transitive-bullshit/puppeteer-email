'use strict'

const faker = require('faker')
const ow = require('ow')
const puppeteer = require('puppeteer')

const PuppeteerEmailProvider = require('puppeteer-email-provider')
const providers = require('./lib/providers')

/**
 * Main entrypoint for authenticating and automating a given email provider.
 *
 * @param {string|PuppeteerEmailProvider} provider - Name of built-in email provider or an
 * email address belonging to a built-in email provider. May also be an instance of a
 * custom PuppeteerEmailProvider.
 *
 * @example
 * const client = new PuppeteerEmail('outlook')
 * const session = await client.signin({ username: 'xxx', password: 'xxx' })
 * const emails = await session.getEmails({ query: 'from:amazon' })
 * await session.close()
 *
 * @example
 * const client = new PuppeteerEmail('test@outlook.com')
 * const session = await client.signin({ email: 'test@outlook.com', password: 'xxx' })
 * await session.close()
 */
class PuppeteerEmail {
  constructor (provider) {
    const p = typeof provider === 'object'
      ? provider
      : (provider.indexOf('@') >= 0)
        ? providers.getProviderByEmail(provider)
        : providers.getProviderByName(provider)
    ow(p, ow.object.instanceOf(PuppeteerEmailProvider))

    this._provider = p
  }

  /**
   * Email provider to automate.
   *
   * @member {PuppeteerEmailProvider}
   */
  get provider () { return this._provider }

  /**
   * Creates a new email account using the set email provider.
   *
   * Any user information that isn't provided will be filled in using
   * [faker.js](https://github.com/Marak/Faker.js).
   *
   * Returns an email session with the authenticated puppeteer browser.
   *
   * @param {object} [user] - User info for the account to create
   * @param {string} [user.username] - Username
   * @param {string} [user.password] - Password
   * @param {string} [user.firstName] - User's given name
   * @param {string} [user.lastName] - User's family name
   * @param {object} [user.birthday] - User's birthday
   * @param {string} [user.birthday.month] - User's birthday month
   * @param {string} [user.birthday.day] - User's birthday day
   * @param {string} [user.birthday.year] - User's birthday year
   *
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<PuppeteerEmailSession>}
   */
  async signup (user, opts = { }) {
    if (!user) user = { }

    if (!user.username) {
      if (user.email) {
        ow(user.email, ow.string.nonEmpty.label('user.email'))
        user.username = user.email.split('@')[0].trim()
      } else {
        user.username = faker.internet.userName()
      }
    }

    if (!user.password) {
      user.password = faker.internet.password()
    }

    ow(user.username, ow.string.nonEmpty.label('user.username'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))

    user.firstName = user.firstName || faker.name.firstName()
    user.lastName = user.lastName || faker.name.lastName()
    user.password = user.password || faker.internet.password()
    user.birthday = user.birthday || { }
    user.birthday.month = user.birthday.month || '' + (random(1, 12) | 0)
    user.birthday.day = user.birthday.day || '' + (random(1, 30) | 0)
    user.birthday.year = user.birthday.year || '' + (random(1960, 1997) | 0)

    const browser = opts.browser || await puppeteer.launch(opts.puppeteer)

    return this._provider.signup(user, {
      browser,
      ...opts
    })
  }

  /**
   * Signs into an existing email account using the set email provider.
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
   * @param {object} [opts] - Options
   * @param {Object} [opts.browser] - Puppeteer browser instance to use
   * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
   *
   * @return {Promise<PuppeteerEmailSession>}
   */
  async signin (user, opts = { }) {
    const browser = opts.browser || await puppeteer.launch(opts.puppeteer)

    ow(user, ow.object.plain.nonEmpty.label('user'))
    ow(user.password, ow.string.nonEmpty.label('user.password'))

    if (user.username) {
      ow(user.username, ow.string.nonEmpty.label('user.username'))
      user.email = `${user.username}@${this._provider.name}.com`
      ow(user.email, ow.string.nonEmpty.label('user.email'))
    } else if (user.email) {
      ow(user.email, ow.string.nonEmpty.label('user.email'))
      user.username = user.email.split('@')[0].trim()
      ow(user.username, ow.string.nonEmpty.label('user.username'))
    } else {
      throw new Error('missing required parameter "username" or "email"')
    }

    return this._provider.signin(user, {
      browser,
      ...opts
    })
  }
}

function random (min, max) {
  return Math.random() * (max - min) + min
}

module.exports = PuppeteerEmail
