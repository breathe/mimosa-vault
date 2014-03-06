
_ = require('underscore')
Vault = require('vault')

# noisily enforce the shape of vault_request object
_checkVault = (obj) ->
  err = "module.exports:"
  if _.isArray(obj)
    throw "#{err} expected object -- found array"
  if _.isFunction(obj)
    throw "#{err} expected object -- found function"
  if not _.isObject(obj)
    throw "#{err} expected object -- found #{typeof(obj)}"

# noisily verify the shape of the options in each vault_request
_checkVaultOptions = (name, options) ->

  # passing 'symbol'>1 to Vaule constructor would break the json encoding of the output ...
  # don't allow user to turn on the symbol option and complain if they do
  ALLOWED_OPTIONS = _.without(i.toLowerCase() for i in _.union(Vault.TYPES, ['length', 'repeat']), "symbol")

  options or= {}
  if not _.isObject(options) or _.isArray(options) or _.isFunction(options)
    throw "error in key: #{name} -- value should be object with keys from #{ALLOWED_OPTIONS}"

  for key, value of ALLOWED_OPTIONS
    if key in options
      if _.isNaN(parseInt(value))
        throw "error in key #{key} -- value should be a Number - found #{key}"

  return options

# derive secrets for @arg:vault_request using supplied @arg:secret
# @return object mapping service_name(s) to derived password(s)
compileVault = (secret, vault_request) ->

  _checkVault(vault_request)

  vault_transformed = {}

  for service_name, service_settings of vault_request
    service_settings = _checkVaultOptions(service_name, service_settings)
    settings = _.extend({}, service_settings, {phrase:secret, symbol:0})
    vault = new Vault(settings)
    password = vault.generate(service_name)
    vault_transformed[service_name] = password

  return vault_transformed

module.exports = compileVault