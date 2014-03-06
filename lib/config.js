"use strict";
var compileVault, crypto, fs, path, _genSecret, _readSecret;

path = require("path");

fs = require("fs");

crypto = require('crypto');

compileVault = require('./plugin');

exports.defaults = function() {
  return {
    vault: {
      extensionRegex: /.vault.[a-zA-Z]+$/,
      secret: null,
      outputExtension: ".json",
      buildSecrets: {}
    }
  };
};

exports.placeholder = function() {
  return "\t\n  vault:\n    extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process\n\n    secret: null                  # path to secret passphrase which should be used to derive the secrets\n                                  # -- should refer to a file at a path outside of the project source control --\n                                  # if null, mimosa will use the path\n                                  # .mimosa/vault/{app}.key within the project directory where {app} is the name of\n                                  # the project as given in the package.json file\n\n    outputExtension: \".json\"      # outputted is formatted as json -- write json file by default\n\n    mimosaSecrets: {}             # secrets which should be derived for the build process and made\n                                  # available for other mimosa-modules as config.vault.mimosaSecrets";
};

_genSecret = function() {
  var seed;
  seed = crypto.randomBytes(100);
  return crypto.createHash('sha1').update(seed).digest('hex');
};

_readSecret = function(secretPath, config) {
  var logger, newKey;
  logger = config.log;
  if (fs.existsSync(secretPath)) {
    logger.info("Reading vault secret at [[ " + secretPath + " ]]");
    return fs.readFileSync(secretPath, "ascii");
  } else {
    newKey = _genSecret();
    fs.writeFile(secretPath, newKey, 'ascii', function(err) {
      if (err) {
        throw "Error writing key to file [[ " + secretPath + " ]]: " + err;
      } else {

      }
      return logger.success("New vault secret written to [[ " + secretPath + " ]]");
    });
  }
  return newKey;
};

exports.validate = function(config, validators) {
  var err, errors, packageName, secretPath, _ref;
  errors = [];
  config.log.debug('validating vault');
  if (validators.ifExistsIsObject(errors, "vault config", config.vault)) {
    if (!(config.vault.extensionRegex instanceof RegExp)) {
      errors.push("vault.extensionRegex must be an instance of RegExp");
    }
    secretPath = config.vault.secret;
    if (secretPath === null) {
      try {
        packageName = require(path.join(config.root, 'package.json')).name;
        secretPath = path.join(config.root, ".mimosa/vault/" + packageName + ".key");
      } catch (_error) {
        err = _error;
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key");
        errors;
      }
    }
    if (!((_ref = config.vault) != null ? _ref._generateKey : void 0)) {
      try {
        config.vault.secret = _readSecret(secretPath, config);
      } catch (_error) {
        err = _error;
        errors.push("Config error -- could not read file given by vault.secret: " + err);
      }
    }
    if (validators.ifExistsIsObject(errors, "build secrets", config.vault.mimosaSecrets)) {
      config.vault.mimosaSecrets = compileVault(config.vault.secret, config.vault.mimosaSecrets);
    }
  }
  return errors;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLFlBQUEsQ0FBQTtBQUFBLElBQUEsdURBQUE7O0FBQUEsSUFFQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLE1BSUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUpULENBQUE7O0FBQUEsWUFLQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBTGYsQ0FBQTs7QUFBQSxPQU9PLENBQUMsUUFBUixHQUFtQixTQUFBLEdBQUE7U0FDakI7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUFnQixtQkFBaEI7QUFBQSxNQUNBLE1BQUEsRUFBUSxJQURSO0FBQUEsTUFFQSxlQUFBLEVBQWlCLE9BRmpCO0FBQUEsTUFHQSxZQUFBLEVBQWMsRUFIZDtLQURGO0lBRGlCO0FBQUEsQ0FQbkIsQ0FBQTs7QUFBQSxPQWNPLENBQUMsV0FBUixHQUFzQixTQUFBLEdBQUE7U0FDcEIsdzVCQURvQjtBQUFBLENBZHRCLENBQUE7O0FBQUEsVUFnQ0EsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUE7QUFBQSxFQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsV0FBUCxDQUFtQixHQUFuQixDQUFQLENBQUE7QUFDQSxTQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE1BQWxCLENBQXlCLENBQUMsTUFBMUIsQ0FBaUMsSUFBakMsQ0FBc0MsQ0FBQyxNQUF2QyxDQUE4QyxLQUE5QyxDQUFQLENBRlc7QUFBQSxDQWhDYixDQUFBOztBQUFBLFdBb0NBLEdB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S0FuQkY7R0FKQTtTQTBCQSxPQTNCaUI7QUFBQSxDQW5EbkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMjIyMgTW9kdWxlIENvbmZpZ3VyYXRpb25cblxuXCJ1c2Ugc3RyaWN0XCJcblxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxuY3J5cHRvID0gcmVxdWlyZSAnY3J5cHRvJ1xuY29tcGlsZVZhdWx0ID0gcmVxdWlyZSAnLi9wbHVnaW4nXG5cbmV4cG9ydHMuZGVmYXVsdHMgPSAtPlxuICB2YXVsdDpcbiAgICBleHRlbnNpb25SZWdleDogLy52YXVsdC5bYS16QS1aXSskL1xuICAgIHNlY3JldDogbnVsbFxuICAgIG91dHB1dEV4dGVuc2lvbjogXCIuanNvblwiXG4gICAgYnVpbGRTZWNyZXRzOiB7fVxuXG5leHBvcnRzLnBsYWNlaG9sZGVyID0gLT5cbiAgXCJcIlwiXG4gIFxcdFxuICAgIHZhdWx0OlxuICAgICAgZXh0ZW5zaW9uUmVnZXg6IC8udmF1bHQuW2EtekEtWl0rJC8gICAgIyByZWdleCBpbmRpY2F0aW5nIGZpbGUgZXh0ZW5zaW9ucyB0aGlzIG1vZHVsZSBzaG91bGQgcHJvY2Vzc1xuXG4gICAgICBzZWNyZXQ6IG51bGwgICAgICAgICAgICAgICAgICAjIHBhdGggdG8gc2VjcmV0IHBhc3NwaHJhc2Ugd2hpY2ggc2hvdWxkIGJlIHVzZWQgdG8gZGVyaXZlIHRoZSBzZWNyZXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIC0tIHNob3VsZCByZWZlciB0byBhIGZpbGUgYXQgYSBwYXRoIG91dHNpZGUgb2YgdGhlIHByb2plY3Qgc291cmNlIGNvbnRyb2wgLS1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgbnVsbCwgbWltb3NhIHdpbGwgdXNlIHRoZSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIC5taW1vc2EvdmF1bHQve2FwcH0ua2V5IHdpdGhpbiB0aGUgcHJvamVjdCBkaXJlY3Rvcnkgd2hlcmUge2FwcH0gaXMgdGhlIG5hbWUgb2ZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgdGhlIHByb2plY3QgYXMgZ2l2ZW4gaW4gdGhlIHBhY2thZ2UuanNvbiBmaWxlXG5cbiAgICAgIG91dHB1dEV4dGVuc2lvbjogXCIuanNvblwiICAgICAgIyBvdXRwdXR0ZWQgaXMgZm9ybWF0dGVkIGFzIGpzb24gLS0gd3JpdGUganNvbiBmaWxlIGJ5IGRlZmF1bHRcblxuICAgICAgbWltb3NhU2VjcmV0czoge30gICAgICAgICAgICAgIyBzZWNyZXRzIHdoaWNoIHNob3VsZCBiZSBkZXJpdmVkIGZvciB0aGUgYnVpbGQgcHJvY2VzcyBhbmQgbWFkZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBhdmFpbGFibGUgZm9yIG90aGVyIG1pbW9zYS1tb2R1bGVzIGFzIGNvbmZpZy52YXVsdC5taW1vc2FTZWNyZXRzXG4gIFwiXCJcIlxuXG5fZ2VuU2VjcmV0ID0gKCkgLT5cbiAgc2VlZCA9IGNyeXB0by5yYW5kb21CeXRlcygxMDApXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShzZWVkKS5kaWdlc3QoJ2hleCcpXG5cbl9yZWFkU2VjcmV0ID0gKHNlY3JldFBhdGgsIGNvbmZpZykgLT5cbiAgbG9nZ2VyID0gY29uZmlnLmxvZ1xuICBpZiBmcy5leGlzdHNTeW5jKHNlY3JldFBhdGgpXG4gICAgbG9nZ2VyLmluZm8gXCJSZWFkaW5nIHZhdWx0IHNlY3JldCBhdCBbWyAje3NlY3JldFBhdGh9IF1dXCJcbiAgICAjIHVzZSBjb250ZW50cyBvZiBmaWxlIGFzIHBhc3NwaHJhc2VcbiAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHNlY3JldFBhdGgsIFwiYXNjaWlcIilcbiAgZWxzZVxuICAgIG5ld0tleSA9IF9nZW5TZWNyZXQoKVxuICAgIGZzLndyaXRlRmlsZSBzZWNyZXRQYXRoLCBuZXdLZXksICdhc2NpaScsIChlcnIpIC0+XG4gICAgICBpZiBlcnJcbiAgICAgICAgdGhyb3cgXCJFcnJvciB3cml0aW5nIGtleSB0byBmaWxlIFtbICN7c2VjcmV0UGF0aH0gXV06ICN7ZXJyfVwiXG4gICAgICBlbHNlXG4gICAgICBsb2dnZXIuc3VjY2VzcyBcIk5ldyB2YXVsdCBzZWNyZXQgd3JpdHRlbiB0byBbWyAje3NlY3JldFBhdGh9IF1dXCJcbiAgcmV0dXJuIG5ld0tleVxuXG5leHBvcnRzLnZhbGlkYXRlID0gKGNvbmZpZywgdmFsaWRhdG9ycykgLT5cbiAgZXJyb3JzID0gW11cblxuICBjb25maWcubG9nLmRlYnVnKCd2YWxpZGF0aW5nIHZhdWx0JylcblxuICBpZiB2YWxpZGF0b3JzLmlmRXhpc3RzSXNPYmplY3QoZXJyb3JzLCBcInZhdWx0IGNvbmZpZ1wiLCBjb25maWcudmF1bHQpXG4gICAgdW5sZXNzIGNvbmZpZy52YXVsdC5leHRlbnNpb25SZWdleCBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgZXJyb3JzLnB1c2ggXCJ2YXVsdC5leHRlbnNpb25SZWdleCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFJlZ0V4cFwiXG5cbiAgICBzZWNyZXRQYXRoID0gY29uZmlnLnZhdWx0LnNlY3JldFxuICAgIGlmIHNlY3JldFBhdGggaXMgbnVsbFxuICAgICAgdHJ5XG4gICAgICAgIHBhY2thZ2VOYW1lID0gcmVxdWlyZShwYXRoLmpvaW4gY29uZmlnLnJvb3QsICdwYWNrYWdlLmpzb24nKS5uYW1lXG4gICAgICAgIHNlY3JldFBhdGggPSBwYXRoLmpvaW4oY29uZmlnLnJvb3QsIFwiLm1pbW9zYS92YXVsdC8je3BhY2thZ2VOYW1lfS5rZXlcIilcbiAgICAgIGNhdGNoIGVyclxuICAgICAgICBlcnJvcnMucHVzaChcIkNvdWxkIG5vdCBmaW5kIHBhY2thZ2UuanNvbiBvciBwYWNrYWdlLmpzb24gZGlkIG5vdCBzcGVjaWZ5IG5hbWUgLS0gcHJvamVjdCBuYW1lIGlzIG5lZWRlZCB0byBmaW5kIHZhdWx0IHNzaCBrZXlcIilcbiAgICAgICAgZXJyb3JzXG5cbiAgICBpZiBub3QgY29uZmlnLnZhdWx0Py5fZ2VuZXJhdGVLZXlcbiAgICAgIHRyeVxuICAgICAgICBjb25maWcudmF1bHQuc2VjcmV0ID0gX3JlYWRTZWNyZXQoc2VjcmV0UGF0aCwgY29uZmlnKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIGVycm9ycy5wdXNoKFwiQ29uZmlnIGVycm9yIC0tIGNvdWxkIG5vdCByZWFkIGZpbGUgZ2l2ZW4gYnkgdmF1bHQuc2VjcmV0OiBcIiArIGVycilcblxuICAgIGlmIHZhbGlkYXRvcnMuaWZFeGlzdHNJc09iamVjdChlcnJvcnMsIFwiYnVpbGQgc2VjcmV0c1wiLCBjb25maWcudmF1bHQubWltb3NhU2VjcmV0cylcbiAgICAgIGNvbmZpZy52YXVsdC5taW1vc2FTZWNyZXRzID0gY29tcGlsZVZhdWx0KGNvbmZpZy52YXVsdC5zZWNyZXQsIGNvbmZpZy52YXVsdC5taW1vc2FTZWNyZXRzKVxuXG4gIGVycm9ycyJdfQ==
