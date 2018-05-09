'use strict'

class PuppeteerEmailProvider {
  constructor (name) {
    this._name = name
  }

  get name () { return this._name }

  signup (user, opts) {
    throw new Error('email provider must override "signup"')
  }

  signin (username, password, opts) {
    throw new Error('email provider must override "signin"')
  }

  signout (session) {
    throw new Error('email provider must override "signout"')
  }

  sendEmail (session, email, opts) {
    throw new Error('email provider must override "sendEmail"')
  }

  getEmails (session, opts) {
    throw new Error('email provider must override "getEmails"')
  }
}

module.exports = PuppeteerEmailProvider
