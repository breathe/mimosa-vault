#### Module Configuration

"use strict"

path = require("path")
fs = require("fs")
crypto = require 'crypto'
compileVault = require './plugin'

exports.defaults = ->
  vault:
    extensionRegex: /.vault.[a-zA-Z]+$/
    secret: null
    outputExtension: ".json"
    buildSecrets: {}

exports.placeholder = ->
  """
  \t
    vault:
      extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process

      secret: null                  # path to secret passphrase which should be used to derive the secrets
                                    # -- should refer to a file at a path outside of the project source control --
                                    # if null, mimosa will use the path
                                    # .mimosa/vault/{app}.key within the project directory where {app} is the name of
                                    # the project as given in the package.json file

      outputExtension: ".json"      # outputted is formatted as json -- write json file by default

      mimosaSecrets: {}             # secrets which should be derived for the build process and made
                                    # available for other mimosa-modules as config.vault.mimosaSecrets
  """

_genSecret = () ->
  seed = crypto.randomBytes(100)
  return crypto.createHash('sha1').update(seed).digest('hex')

_readSecret = (secretPath, config) ->
  logger = config.log
  if fs.existsSync(secretPath)
    logger.info "Reading vault secret at [[ #{secretPath} ]]"
    # use contents of file as passphrase
    return fs.readFileSync(secretPath, "ascii")
  else
    newKey = _genSecret()
    fs.writeFile secretPath, newKey, 'ascii', (err) ->
      if err
        throw "Error writing key to file [[ #{secretPath} ]]: #{err}"
      else
      logger.success "New vault secret written to [[ #{secretPath} ]]"
  return newKey

exports.validate = (config, validators) ->
  errors = []

  config.log.debug('validating vault')

  if validators.ifExistsIsObject(errors, "vault config", config.vault)
    unless config.vault.extensionRegex instanceof RegExp
      errors.push "vault.extensionRegex must be an instance of RegExp"

    secretPath = config.vault.secret
    if secretPath is null
      try
        packageName = require(path.join config.root, 'package.json').name
        secretPath = path.join(config.root, ".mimosa/vault/#{packageName}.key")
      catch err
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key")
        errors

    if not config.vault?._generateKey
      try
        config.vault.secret = _readSecret(secretPath, config)
      catch err
        errors.push("Config error -- could not read file given by vault.secret: " + err)

    if validators.ifExistsIsObject(errors, "build secrets", config.vault.mimosaSecrets)
      config.vault.mimosaSecrets = compileVault(config.vault.secret, config.vault.mimosaSecrets)

  errors