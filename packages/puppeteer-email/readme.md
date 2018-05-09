# puppeteer-email

> Email automation drive by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-email.svg)](https://www.npmjs.com/package/puppeteer-email) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-email.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-email) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save puppeteer-email
```

You'll also need to install at least one provider.


## Usage

This example signs into an [Outlook](https://outlook.live.com) account, searches for a given query, and then parses and returns all emails returned for that query.

```js
const PuppeteerEmail = require('puppeteer-email')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')

const provider = new PuppeteerEmailProviderOutlook()
const client = new PuppeteerEmail(provider)

const username = 'XXX'
const password = 'XXX'

const session = await client.signin({ username, password })
const emails = await session.getEmails({ query: 'from:github' })
await session.close()
console.log(emails)
```

Example parsed email output:

```js
[
  {
    "attachments": [ /* ... */ ],
    "headers": { /* ... */ },
    "html": "<!DOCTYPE html>\n<html>...</html>",
    "text": "...",
    "textAsHtml": "<p>...</p>",
    "subject": "Example email subject",
    "date": "2018-05-09T14:17:02.000Z",
    "to": {
      "value": [
        {
          "address": "fischxxxx@outlook.com",
          "name": "Travis Fischer"
        }
      ],
      "html": "<span class=\"mp_address_name\">Travis Fischer</span> &lt;<a href=\"mailto:fischxxxx@outlook.com\" class=\"mp_address_email\">fischxxxx@outlook.com</a>&gt;",
      "text": "Travis Fischer <fischxxxx@outlook.com>"
    },
    "from": {
      "value": [
        {
          "address": "noreply@github.com",
          "name": "GitHub"
        }
      ],
      "html": "<span class=\"mp_address_name\">GitHub</span> &lt;<a href=\"mailto:noreply@github.com\" class=\"mp_address_email\">noreply@github.com</a>&gt;",
      "text": "GitHub <noreply@github.com>"
    },
    "messageId": "<01.B3.11399.xxxxxxxx@momentum1-mta1>"
  }
]
```

See [parse-email](https://github.com/transitive-bullshit/parse-email) for details on email model properties.


## API

**TODO**

- puppeteer-email
  - constructor(provider: PuppeteerEmailProvider)
  - signup: function(user: PuppeteerEmailUser, opts) => Promise<PuppeteerEmailSession>
  - signin: function(user: Object, opts) => Promise<PuppeteerEmailSession>


## Related

- [puppeteer-email-cli](packages/puppeteer-email-cli) - CLI for executing one-off email automation tasks.
- [puppeteer-email-session](https://github.com/transitive-bullshit/puppeteer-email/tree/master/packages/puppeteer-email-session) - Holds state for an authenticated puppeteer email session.
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
