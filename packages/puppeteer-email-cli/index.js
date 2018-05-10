#!/usr/bin/env node
'use strict'

const compatRequire = require('node-compat-require')
compatRequire('./lib/cli', { node: '>= 8' })
