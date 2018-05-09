# puppeteer-email

> Email automation driven by headless chrome.


## Status

Heavy WIP.


## Packages

This project is a WIP, with the following planned packages.

- puppeteer-email
  - constructor(provider: PuppeteerEmailProvider)
  - signup: function(user: PuppeteerEmailUser, opts) => Promise<PuppeteerEmailSession>
  - signin: function(user: Object, opts) => Promise<PuppeteerEmailSession>

- puppeteer-email-cli

- puppeteer-email-provider
  - signup: function(user: PuppeteerEmailUser, opts) => Promise<PuppeteerEmailSession>
  - signin: function(user: Object, opts) => Promise<PuppeteerEmailSession>
  - signout: function(session: PuppeteerEmailSession) => Promise
  - sendEmail: function(session: PuppeteerEmailSession, email: Object, opts) => Promise
  - getEmails: function(session: PuppeteerEmailSession, opts) => Promise<PuppeteerEmailModel>

- puppeteer-email-model
  - to: String
  - from: String
  - subject: String
  - text: String
  - html: String

- puppeteer-email-user
  - username: String
  - password: String
  - firstName: String
  - lastName: String
  - birthday: Object
    - day: Number
    - month: Number
    - year: Number

- puppeteer-email-session
  - username: String
  - email: String
  - browser: Puppeteer.Browser
  - provider: PuppeteerEmailProvider
  - isAuthenticated: Boolean
  - signout: function() => Promise
  - sendEmail: function(email: PuppeteerEmailModel, opts) => Promise
  - getEmails: function(opts) => Promise

- puppeteer-email-provider-outlook
- puppeteer-email-provider-gmail
- puppeteer-email-provider-...

- captcha-solver
- sms-verifier


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
