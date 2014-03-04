#### Module Interface

"use strict"

config = require './config'
logger = null
sh = require 'shelljs'

registration = (config, register) ->
  logger = config.log

  extensions = config.extensions.javascript

  logger.debug("extensions are: #{config.extensions}")

  register(['buildFile','add','update'], 'afterCompile', _buildVault, extensions);

_buildVault = (mimosaConfig, options, next) ->
  config = mimosaConfig.vault
  logger = mimosaConfig.log

  for file in options.files
    if ( file.outputFileName.match(config.extensionRegex))
      file.outputFileText = _fault_for_file(config, file)
  next()

_vaultFile = (config, file) ->
  # parse the output object
  noSecrets = JSONParse(file.outputFileText)
  compiledSecrets = {}

  for service, subservice of noSecrets
    if Array.isArray(subservice)
      sh.exec

_wrapVaultCommand = (cmdString) ->
  sh.exec(cmdString)








# The registerCommand function is used to register new Mimosa commands. If this function is implemented
# Mimosa will call it during startup so the module has an opportunity to respond to the command line.
#
# registerCommand is passed 2 arguments:
#
# 1. program, a commander.js program object, read more here: http://visionmedia.github.com/commander.js/
# Use this object to create a command, the flags for it, any input values, the help text and the callback
# for the command.
# 2. retrieveConfig, a function, use retrieveConfig to have Mimosa execute a build and get the mimosa-config
# before a module's code is executed.  retrieveConfig takes two parameters, the first is a flag to indicate
# if a build is needed before module code is executed.  The second is a callback that should contain the
# module's functionality.  That callback is passed the mimosa-config.

registerCommand = (program, retrieveConfig) ->
  program
    .command('foo')
    .description("Do something fooey")
    .action ->
      retrieveConfig false, config ->

# The module.exports exposes module code to Mimosa.  The properties that
# are exported are Mimosa's hook to your module.  Mimosa will attempt
# to access functions that are placed into this exports matching these names:
#
# 1. registration: This function is called to bind your module to a Mimosa workflow.
# 2. registerCommand: This function is called to create a new Mimosa command.
# 3. defaults: This function is called to access the default configuration for your module.
# See <a href="./config.html">config.coffee</a>.
# 4. placeholder: This function is used to build a mimosa-config during 'mimosa new' and
# 'mimosa config'. See <a href="./config.html">config.coffee</a>.
# 5. validate: This function is called during Mimosa's startup to validate the mimosa-config.
# This is your module's opportunity to ensure the configuration it will be given later is
# valid. See <a href="./config.html">config.coffee</a>.
#
# Any other functions exported will be ignored by Mimosa, but may be useful to you if you have
# multiple modules that need to talk to one another.

module.exports =
  registration:    registration
  registerCommand: registerCommand
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate