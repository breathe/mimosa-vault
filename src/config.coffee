#### Module Configuration

"use strict"

path = require("path")
fs = require("fs")

exports.defaults = ->
  vault:
    secretpath: null

exports.placeholder = ->
  """
  \t
    vault:
      extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process
      secretpath: null              # path to ssh key which should be used to derive the secrets
                                    # -- should refer to a path outside of the project dir --
                                    # if null, mimosa will use the path
                                    # ~/.mimosa/vault/{app}.key where {app} is the name of the
                                    # project as given in the package.json file
  """

_checkSecretPath = (secretPath, config) ->
  if fs.existsSync(secretPath)
    config.log.info "Found ssh key for vault at [[ secretPath ]]"
    # make sure the file can be read
    fs.readFileSync(secretPath)
  else
    throw "No ssh-key found at [[ secretPath ]].  Run mimosa vault:new-key to generate one for this site or copy key into place"

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "vault config", config.vault)

    unless config.vault.extensionRegex instanceof RegExp
      errors.push "vault.extensionRegex must be an instance of RegExp"

    if config.vault.secretpath
      validators.isString(errors, "vault.secretpath", config.vault.secretpath)
    else
      try
        packageName = require(path.join config.root, 'package.json').name
        config.vault.secretpath = path.join(config.root, ".mimosa/vault/#{packageName}.key")
      catch err
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key")
    try
      _checkSecretPath(config.vault.secretpath)
    catch err
      errors.push("Error reading path to ssh key specified by vault.secretpath: " + err)

  errors