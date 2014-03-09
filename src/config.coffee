#### Module Configuration

"use strict"

path = require("path")
fs = require("fs")
path = require("path")
wrench = require("wrench")
crypto = require 'crypto'
compileVault = require './plugin'

exports.defaults = ->
  vault:
    extensionRegex: /.vault.[a-zA-Z]+$/
    secret: null
    outputExtension: ".json"
    buildSecrets: {}
    enforcePermissions: true

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
                                    # available for other mimosa-modules as mimosaConfig.vault.mimosaSecrets
      enforcePermissions: true      # will chmod vault.secret and generated files to ensure they are readable by
                                    # file owner only
  """

_genSecret = () ->
  seed = crypto.randomBytes(100)
  return crypto.createHash('sha1').update(seed).digest('hex')

_modifyPermissions = (secretPath, mimosaConfig) ->
  if mimosaConfig.vault.enforcePermissions
    mimosaConfig.log.info("Setting permissions on vault secret file [[ #{secretPath} ]] to owner read/write only")
    fs.chmodSync(secretPath, 0o600)

_readSecret = (secretPath, mimosaConfig) ->
  logger = mimosaConfig.log

  if fs.existsSync(secretPath)
    _modifyPermissions(secretPath, mimosaConfig)

    logger.info "Reading vault secret at [[ #{secretPath} ]]"
    return fs.readFileSync(secretPath, "ascii")
  else
    wrench.mkdirSyncRecursive(path.dirname(secretPath), 0o700)

    fs.openSync(secretPath, 'w')
    _modifyPermissions(secretPath, mimosaConfig)

    newKey = _genSecret()

    fs.writeFile secretPath, newKey, 'ascii', (err) ->
      if err
        throw "Error writing key to file [[ #{secretPath} ]]: #{err}"
      else
        logger.success "New vault secret written to [[ #{secretPath} ]]"


  return newKey

exports.validate = (mimosaConfig, validators) ->
  errors = []

  mimosaConfig.log.debug('validating vault')

  if validators.ifExistsIsObject(errors, "vault mimosaConfig", mimosaConfig.vault)
    unless mimosaConfig.vault.extensionRegex instanceof RegExp
      errors.push "vault.extensionRegex must be an instance of RegExp"

    validators.ifExistsIsBoolean(errors, "enforce permissions", mimosaConfig.vault.enforcePermissions)

    secretPath = mimosaConfig.vault.secret
    if secretPath is null
      try
        packageName = require(path.join mimosaConfig.root, 'package.json').name
        secretPath = path.join(mimosaConfig.root, ".mimosa/vault/#{packageName}.key")
      catch err
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key")
        errors

    if not mimosaConfig.vault?._generateKey
      try
        mimosaConfig.vault.secret = _readSecret(secretPath, mimosaConfig)
      catch err
        errors.push("mimosaConfig error -- could not read file given by vault.secret: " + err)

    if validators.ifExistsIsObject(errors, "build secrets", mimosaConfig.vault.mimosaSecrets)
      mimosaConfig.vault.mimosaSecrets = compileVault(mimosaConfig.vault.secret, mimosaConfig.vault.mimosaSecrets)

  errors