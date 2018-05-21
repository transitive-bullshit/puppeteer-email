# puppeteer-email

> Email automation driven by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-email.svg)](https://www.npmjs.com/package/puppeteer-email) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-email.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-email) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Features

- automate email account creation
- automate email sending
- automate email fetching
- automate email verification from third-party services
  - twitter
  - github
  - facebook
  - etc.
- comes with a [library](packages/puppeteer-email) and [CLI](packages/puppeteer-email-cli)
- uses [puppeteer](https://github.com/GoogleChrome/puppeteer) under the hood
- perfect for bots...


## Status

This project is an early WIP, but the [CLI](packages/puppeteer-email-cli) currently works to automate [Outlook](https://outlook.live.com).


## Packages

- [puppeteer-email](packages/puppeteer-email) - Main library entrypoint.
- [puppeteer-email-cli](packages/puppeteer-email-cli) - CLI for executing one-off email automation tasks.
- [puppeteer-email-session](packages/puppeteer-email-session) - Holds state for an authenticated puppeteer email session.
- [puppeteer-email-provider](packages/puppeteer-email-provider) - Abstract base class for puppeteer email providers.
  - [puppeteer-email-provider-outlook](packages/puppeteer-email-provider-outlook) - Puppeteer email provider for [Outlook](https://outlook.live.com).
  - [puppeteer-email-provider-gmail](packages/puppeteer-email-provider-gmail) - Puppeteer email provider for [Gmail](https://www.google.com/gmail). (TODO)
  - [puppeteer-email-provider-yahoo](packages/puppeteer-email-provider-yahoo) - Puppeteer email provider for [Yahoo Mail](https://mail.yahoo.com/). (TODO)
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.
- [sms-number-verifier](https://github.com/transitive-bullshit/sms-number-verifier) - Allows you to spoof SMS number verification.


## Usage

### CLI

```bash
npm install -g puppeteer-email-cli
```

```bash
  Usage: puppeteer-email [options] [command]

  Options:

    -V, --version              output the version number
    -u, --username <username>  email account username
    -p, --password <password>  email account password
    -P, --provider <provider>  email provider (default: outlook)
    -H, --no-headless          (puppeteer) disable headless mode
    -s, --slow-mo <timeout>    (puppeteer) slows down operations by the given ms (default: 0)
    -h, --help                 output usage information

  Commands:

    signup [options]
    signin
    get-emails [options]
```

See the [CLI](packages/puppeteer-email-cli) for more in-depth CLI docs.


### Library

This example signs into an [Outlook](https://outlook.live.com) account, searches for a given query, and then parses and returns all emails returned for that query.

```bash
npm install --save puppeteer-email
```

```js
const PuppeteerEmail = require('puppeteer-email')

const client = new PuppeteerEmail('outlook')

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

See the [library](packages/puppeteer-email) for more in-depth library docs.

See [parse-email](https://github.com/transitive-bullshit/parse-email) for details on email model properties.


## Related

- [puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API used under the hood.
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.
- [sms-number-verifier](https://github.com/transitive-bullshit/sms-number-verifier) - Allows you to spoof SMS number verification.
- [puppeteer-github](https://github.com/transitive-bullshit/puppeteer-github) - GitHub automation driven by headless chrome.
- [awesome-puppeteer](https://github.com/transitive-bullshit/awesome-puppeteer) - A curated list of awesome puppeteer resources.


## Disclaimer

Using this software to violate the terms and conditions of any third-party service is strictly against the intent of this software. By using this software, you are acknowledging this fact and absolving the author or any potential liability or wrongdoing it may cause. This software is meant for testing and experimental purposes only, so please act responsibly.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
