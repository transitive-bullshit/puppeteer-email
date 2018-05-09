'use strict'

const ow = require('ow')
const PuppeteerEmailSession = require('puppeteer-email-session')

class PuppeteerEmailProvider {
  signup (user, opts) {
    ow(user, ow.object.plain.nonEmpty)
    ow(user.username, ow.string.nonEmpty)
    ow(user.password, ow.string.nonEmpty)

    throw new Error('email provider must override "signup"')
  }

  signin (username, password, opts) {
    ow(username, ow.string.nonEmpty)
    ow(password, ow.string.nonEmpty)

    throw new Error('email provider must override "signin"')
  }

  signout (session) {
    ow(session, ow.instanceOf(PuppeteerEmailSession))

    throw new Error('email provider must override "signout"')
  }

  sendEmail (session, email, opts) {
    ow(session, ow.instanceOf(PuppeteerEmailSession))
    ow(email, ow.object)

    throw new Error('email provider must override "sendEmail"')
  }

  getEmails (session, opts) {
    ow(session, ow.instanceOf(PuppeteerEmailSession))

    throw new Error('email provider must override "getEmails"')
  }
}

module.exports = PuppeteerEmailProvider
