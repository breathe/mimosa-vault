#### Module Interface

"use strict"

fs = require 'fs'
config = require './config'
logger = null
compileVault = require('./plugin')
sjcl = require('sjcl')
_ = require 'underscore'

_requireFromString = (src, filename) ->
  Module = module.constructor
  m = new Module()
  m._compile(src, filename)
  return m.exports

_outputFileName = (mimosaConfig, inputFileName) ->
  inputFileName.replace(mimosaConfig.extensionRegex, mimosaConfig.outputExtension)

_encryptOrJsonify = (passwords, encryptionSecret) ->
  # if no encryption keys were supplied, return the plaintext as a string
  if _.isNull(encryptionSecret)
    return JSON.stringify(passwords)

  # otherwise, return the vault represented as an encrypted string
  return JSON.stringify(sjcl.encrypt(encryptionSecret, JSON.stringify(passwords)))

_transformOutput = (passwords, vaultConfig) ->
  # this will give us the vaultText representation encrypted or not as decided by vaultConfig.encryptWith parameter
  vaultText = _encryptOrJsonify(passwords, vaultConfig.encryptionSecret)

  isEncrypted = not _.isNull(vaultConfig.encryptionSecret)

  if vaultConfig.outputFormat is "json"
    return vaultText
  else if vaultConfig.outputFormat is "commonjs"
    module = "var embeddedVault = #{vaultText};\n"
    if not isEncrypted
      moduleFunc = () -> embeddedVault
    else
      module += "var sjcl = require('sjcl');\n"
      moduleFunc = (password) -> JSON.parse(sjcl.decrypt(password, embeddedVault))
    module += "module.exports = " + moduleFunc.toString()
    return module

_compileExtension = (mimosaConfig, options, next) ->
  vaultConfig = mimosaConfig.vault
  logger = mimosaConfig.log

  if (options.inputFile.match(vaultConfig.extensionRegex))
    file = options.files[0]
    try
      json_obj = _requireFromString(file.outputFileText, file.outputFileName)

      file.outputFileText = _transformOutput(compileVault(vaultConfig.passwordGenerationSecret, json_obj), vaultConfig)
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