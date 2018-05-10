'use strict'

const { test } = require('ava')
const execa = require('execa')

test('--version', async (t) => {
  const { stdout } = await execa('./index.js', [ '--version' ])
  t.true(stdout.length > 0)
})
