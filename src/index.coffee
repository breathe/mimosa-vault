#### Module Interface

"use strict"

fs = require 'fs'

config = require './config'
logger = null

_ = require 'underscore'
compileVault = require('./plugin')

_requireFromString = (src, filename) ->
  Module = module.constructor
  m = new Module()
  m._compile(src, filename)
  return m.exports

_outputFileName = (config, inputFileName) ->
  inputFileName.replace(config.extensionRegex, config.outputExtension)

_compileExtension = (mimosaConfig, options, next) ->
  config = mimosaConfig.vault
  logger = mimosaConfig.log

  if (options.inputFile.match(config.extensionRegex))
    file = options.files[0]
    try
      json_obj = _requireFromString(file.outputFileText, file.outputFileName)
      file.outputFileText = JSON.stringify(compileVault(config.secret, json_obj))
      file.outputFileName = _outputFileName(config, file.outputFileName)
    catch err
      logger.error("mimosa-vault failed to process [[ #{file.inputFileName} ]]: #{err}")
      options.files.splice(options.files.indexOf(file, 1))
  next()

registration = (config, register) ->
  extensions = config.extensions.javascript
  register(['buildFile','add','update'], 'afterCompile', _compileExtension, extensions);

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate
  compileVaule:    compileVault