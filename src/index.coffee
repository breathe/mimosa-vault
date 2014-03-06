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

_outputFileName = (mimosaConfig, inputFileName) ->
  inputFileName.replace(mimosaConfig.extensionRegex, mimosaConfig.outputExtension)

_compileExtension = (mimosaConfig, options, next) ->
  vaultConfig = mimosaConfig.vault
  logger = mimosaConfig.log

  if (options.inputFile.match(vaultConfig.extensionRegex))
    file = options.files[0]
    try
      json_obj = _requireFromString(file.outputFileText, file.outputFileName)
      file.outputFileText = JSON.stringify(compileVault(vaultConfig.secret, json_obj))
      file.outputFileName = _outputFileName(vaultConfig, file.outputFileName)
    catch err
      logger.error("mimosa-vault failed to process [[ #{file.inputFileName} ]]: #{err}")
      options.files.splice(options.files.indexOf(file, 1))
  next()

registration = (mimosaConfig, register) ->
  extensions = mimosaConfig.extensions.javascript
  register(['buildFile','add','update'], 'afterCompile', _compileExtension, extensions);

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate