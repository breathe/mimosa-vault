
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

  # passing 'symbol'>1 to Vault constructor would break the json encoding of the output ...
  # don't allow user to turn on the symbol option and complain if they do
  ALLOWED_OPTIONS = (i.toLowerCase() for i in _.union(Vault.TYPES, ['length', 'repeat', 'revision']))

  options or= {}
  if not _.isObject(options) or _.isArray(options) or _.isFunction(options)
    throw "error with value of key: #{name} -- should be object with keys from #{ALLOWED_OPTIONS}"

  for key, value of options
    if key not in ALLOWED_OPTIONS
      throw "error with #{name} -- invalid option #{key} supplied"
    else
      if _.isNaN(parseInt(value))
        throw "error with #{name}[\"#{key}\"] -- expected Number - found #{key}"

  if options.revision?
    name = "#{name}-#{options.revision}"

  return [name, options]

# derive secrets for @arg:vault_request using supplied @arg:secret
# @return object mapping service_name(s) to derived password(s)
compileVault = (secret, vault_request) ->

  _checkVault(vault_request)

  vault_transformed = {}

  for service_name, service_settings of vault_request
    [service_revision_name, service_settings] = _checkVaultOptions(service_name, service_settings)
    settings = _.extend({}, service_settings, {phrase:secret, symbol:0})
    vault = new Vault(settings)
    password = vault.generate(service_revision_name)
    vault_transformed[service_name] = password

  return vault_transformed

module.exports = compileVault