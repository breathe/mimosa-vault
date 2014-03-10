#### Module Configuration

"use strict"

path = require("path")
fs = require("fs")
path = require("path")
wrench = require("wrench")
crypto = require 'crypto'
compileVault = require './plugin'
_ = require('underscore')

exports.defaults = ->
  vault:
    extensionRegex: /.vault.[a-zA-Z]+$/
    passwordGenerationSecret: null
    encryptionSecret: null
    outputFormat: "json"
    mimosaPasswords: {}
    enforceFilePermissions: true

exports.placeholder = ->
  """
  \t
    vault:
      extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process

      passwordGenerationSecret: null    # path to secret passphrase which should be used to derive the secrets
                                        # -- should refer to a file at a path outside of the project source control --
                                        # if null, mimosa will use the path
                                        # .mimosa/vault/{app}.key within the project directory where {app} is the name
                                        # of the project as given in the package.json file

      encryptionSecret: null        # Path to secret passphrase which should be used to encrypt the generated files
                                    # if left null, the output files will not be encrypted.  If defined and a file does
                                    # not exist at vault.encryptionSecret mimosa-vault will create a new secret to
                                    # encrypt the output with

      outputFormat: "json"          # specify the output format -- either json or commonjs.
                                    # if commonjs, module will export a single function which returns the vault
                                    # if encryption is used the function will expect to be passed the secret needed
                                    # to decrypt the vault -- the function returns decrypted vault or throws an error
                                    # if the vault with the supplied password

      mimosaPasswords: {}           # passwords which should be made available to other mimosa-modules
                                    # at mimosaConfig.vault.mimosaPasswords

      enforceFilePermissions: true  # will chmod vault.secret and generated files to ensure they are readable by
                                    # file owner only
  """

_genSecret = () ->
  seed = crypto.randomBytes(100)
  return crypto.createHash('sha1').update(seed).digest('hex')

_modifyPermissions = (passwordGenerationSecret, mimosaConfig) ->
  if mimosaConfig.vault.enforceFilePermissions
    mimosaConfig.log.info("Setting permissions on vault secret file [[ #{passwordGenerationSecret} ]] to owner read/write only")
    fs.chmodSync(passwordGenerationSecret, 0o600)

_readOrCreateSecret = (secret, mimosaConfig) ->
  logger = mimosaConfig.log

  if fs.existsSync(secret)
    _modifyPermissions(secret, mimosaConfig)

    logger.info "Reading vault secret at [[ #{secret} ]]"
    return fs.readFileSync(secret, "ascii")
  else
    wrench.mkdirSyncRecursive(path.dirname(secret), 0o700)

    fs.openSync(secret, 'w')
    _modifyPermissions(secret, mimosaConfig)

    newKey = _genSecret()

    fs.writeFile secret, newKey, 'ascii', (err) ->
      if err
        throw "Error writing key to file [[ #{secret} ]]: #{err}"
      else
        logger.success "New vault secret written to [[ #{secret} ]]"


  return newKey

exports.validate = (mimosaConfig, validators) ->
  errors = []

  mimosaConfig.log.debug('validating vault')

  if validators.ifExistsIsObject(errors, "vault mimosaConfig", mimosaConfig.vault)
    unless mimosaConfig.vault.extensionRegex instanceof RegExp
      errors.push "vault.extensionRegex must be an instance of RegExp"

    validators.ifExistsIsBoolean(errors, "enforce permissions", mimosaConfig.vault.enforceFilePermissions)

    passwordGenerationSecret = mimosaConfig.vault.passwordGenerationSecret
    # generate default path for passwordGenerationSecret if one is not specified
    if passwordGenerationSecret is null
      try
        packageName = require(path.join mimosaConfig.root, 'package.json').name
        passwordGenerationSecret = path.join(mimosaConfig.root, ".mimosa/vault/#{packageName}-passwordGeneration.key")
      catch err
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key")
        errors

    # read the passwordGenerationKey or create one if one does not already exist
    try
      mimosaConfig.vault.passwordGenerationSecret = _readOrCreateSecret(passwordGenerationSecret, mimosaConfig)
    catch err
      errors.push("mimosaConfig error -- could not read file given by vault.passwordGenerationSecret: " + err)

    # handle case where encryptionSecret === true
    encryptionSecret = mimosaConfig.vault.encryptionSecret
    if _.isBoolean(encryptionSecret) and encryptionSecret
      encryptionSecret = path.join(mimosaConfig.root, ".mimosa/vault/#{packageName}-encryption.key")

    # if encryptionSecret is defined, it should specify a path
    if encryptionSecret?
      try
        mimosaConfig.vault.encryptionSecret = _readOrCreateSecret(encryptionSecret, mimosaConfig)
      catch err
        errors.push("mimosaConfig error -- could not read file given by vault.encryptionSecret: " + err)

    if validators.ifExistsIsObject(errors, "vault derived passwords for other mimosa modules", mimosaConfig.vault.mimosaPasswords)
      mimosaConfig.vault.mimosaPasswords = compileVault(mimosaConfig.vault.secret, mimosaConfig.vault.mimosaPasswords)

    if validators.ifExistsIsString(errors, "output format", mimosaConfig.vault.outputFormat)
      if mimosaConfig.vault.outputFormat == "json"
        mimosaConfig.vault.outputExtension = ".json"
      else if mimosaConfig.vault.outputFormat == "commonjs"
        mimosaConfig.vault.outputExtension = ".js"
      else
        errors.push("mimosa-config error -- vault.outputFormat should be one of 'json' or 'commonjs' found #{mimosaConfig.vault.outputFormat}")

  errors