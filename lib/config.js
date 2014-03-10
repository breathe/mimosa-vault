"use strict";
var compileVault, crypto, fs, path, wrench, _, _genSecret, _modifyPermissions, _readOrCreateSecret;

path = require("path");

fs = require("fs");

path = require("path");

wrench = require("wrench");

crypto = require('crypto');

compileVault = require('./plugin');

_ = require('underscore');

exports.defaults = function() {
  return {
    vault: {
      extensionRegex: /.vault.[a-zA-Z]+$/,
      passwordGenerationSecret: null,
      encryptionSecret: null,
      outputFormat: "json",
      mimosaPasswords: {},
      enforceFilePermissions: true
    }
  };
};

exports.placeholder = function() {
  return "\t\n  vault:\n    extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process\n\n    passwordGenerationSecret: null    # path to secret passphrase which should be used to derive the secrets\n                                      # -- should refer to a file at a path outside of the project source control --\n                                      # if null, mimosa will use the path\n                                      # .mimosa/vault/{app}.key within the project directory where {app} is the name\n                                      # of the project as given in the package.json file\n\n    encryptionSecret: null        # Path to secret passphrase which should be used to encrypt the generated files\n                                  # if left null, the output files will not be encrypted.  If defined and a file does\n                                  # not exist at vault.encryptionSecret mimosa-vault will create a new secret to\n                                  # encrypt the output with\n\n    outputFormat: \"json\"          # specify the output format -- either json or commonjs.\n                                  # if commonjs, module will export a single function which returns the vault\n                                  # if encryption is used the function will expect to be passed the secret needed\n                                  # to decrypt the vault -- the function returns decrypted vault or throws an error\n                                  # if the vault with the supplied password\n\n    mimosaPasswords: {}           # passwords which should be made available to other mimosa-modules\n                                  # at mimosaConfig.vault.mimosaPasswords\n\n    enforceFilePermissions: true  # will chmod vault.secret and generated files to ensure they are readable by\n                                  # file owner only";
};

_genSecret = function() {
  var seed;
  seed = crypto.randomBytes(100);
  return crypto.createHash('sha1').update(seed).digest('hex');
};

_modifyPermissions = function(passwordGenerationSecret, mimosaConfig) {
  if (mimosaConfig.vault.enforceFilePermissions) {
    mimosaConfig.log.info("Setting permissions on vault secret file [[ " + passwordGenerationSecret + " ]] to owner read/write only");
    return fs.chmodSync(passwordGenerationSecret, 0x180);
  }
};

_readOrCreateSecret = function(secret, mimosaConfig) {
  var logger, newKey;
  logger = mimosaConfig.log;
  if (fs.existsSync(secret)) {
    _modifyPermissions(secret, mimosaConfig);
    logger.info("Reading vault secret at [[ " + secret + " ]]");
    return fs.readFileSync(secret, "ascii");
  } else {
    wrench.mkdirSyncRecursive(path.dirname(secret), 0x1c0);
    fs.openSync(secret, 'w');
    _modifyPermissions(secret, mimosaConfig);
    newKey = _genSecret();
    fs.writeFile(secret, newKey, 'ascii', function(err) {
      if (err) {
        throw "Error writing key to file [[ " + secret + " ]]: " + err;
      } else {
        return logger.success("New vault secret written to [[ " + secret + " ]]");
      }
    });
  }
  return newKey;
};

exports.validate = function(mimosaConfig, validators) {
  var encryptionSecret, err, errors, packageName, passwordGenerationSecret;
  errors = [];
  mimosaConfig.log.debug('validating vault');
  if (validators.ifExistsIsObject(errors, "vault mimosaConfig", mimosaConfig.vault)) {
    if (!(mimosaConfig.vault.extensionRegex instanceof RegExp)) {
      errors.push("vault.extensionRegex must be an instance of RegExp");
    }
    validators.ifExistsIsBoolean(errors, "enforce permissions", mimosaConfig.vault.enforceFilePermissions);
    passwordGenerationSecret = mimosaConfig.vault.passwordGenerationSecret;
    if (passwordGenerationSecret === null) {
      try {
        packageName = require(path.join(mimosaConfig.root, 'package.json')).name;
        passwordGenerationSecret = path.join(mimosaConfig.root, ".mimosa/vault/" + packageName + "-passwordGeneration.key");
      } catch (_error) {
        err = _error;
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key");
        errors;
      }
    }
    try {
      mimosaConfig.vault.passwordGenerationSecret = _readOrCreateSecret(passwordGenerationSecret, mimosaConfig);
    } catch (_error) {
      err = _error;
      errors.push("mimosaConfig error -- could not read file given by vault.passwordGenerationSecret: " + err);
    }
    encryptionSecret = mimosaConfig.vault.encryptionSecret;
    if (_.isBoolean(encryptionSecret) && encryptionSecret) {
      encryptionSecret = path.join(mimosaConfig.root, ".mimosa/vault/" + packageName + "-encryption.key");
    }
    if (encryptionSecret != null) {
      try {
        mimosaConfig.vault.encryptionSecret = _readOrCreateSecret(encryptionSecret, mimosaConfig);
      } catch (_error) {
        err = _error;
        errors.push("mimosaConfig error -- could not read file given by vault.encryptionSecret: " + err);
      }
    }
    if (validators.ifExistsIsObject(errors, "vault derived passwords for other mimosa modules", mimosaConfig.vault.mimosaPasswords)) {
      mimosaConfig.vault.mimosaPasswords = compileVault(mimosaConfig.vault.secret, mimosaConfig.vault.mimosaPasswords);
    }
    if (validators.ifExistsIsString(errors, "output format", mimosaConfig.vault.outputFormat)) {
      if (mimosaConfig.vault.outputFormat === "json") {
        mimosaConfig.vault.outputExtension = ".json";
      } else if (mimosaConfig.vault.outputFormat === "commonjs") {
        mimosaConfig.vault.outputExtension = ".js";
      } else {
        errors.push("mimosa-config error -- vault.outputFormat should be one of 'json' or 'commonjs' found " + mimosaConfig.vault.outputFormat);
      }
    }
  }
  return errors;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLFlBQUEsQ0FBQTtBQUFBLElBQUEsOEZBQUE7O0FBQUEsSUFFQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLElBSUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsTUFLQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBTFQsQ0FBQTs7QUFBQSxNQU1BLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FOVCxDQUFBOztBQUFBLFlBT0EsR0FBZSxPQUFBLENBQVEsVUFBUixDQVBmLENBQUE7O0FBQUEsQ0FRQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBUkosQ0FBQTs7QUFBQSxPQVVPLENBQUMsUUFBUixHQUFtQixTQUFBLEdBQUE7U0FDakI7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUFnQixtQkFBaEI7QUFBQSxNQUNBLHdCQUFBLEVBQTBCLElBRDFCO0FBQUEsTUFFQSxnQkFBQSxFQUFrQixJQUZsQjtBQUFBLE1BR0EsWUFBQSxFQUFjLE1BSGQ7QUFBQSxNQUlBLGVBQUEsRUFBaUIsRUFKakI7QUFBQSxNQUtBLHNCQUFBLEVBQXdCLElBTHhCO0tBREY7SUFEaUI7QUFBQSxDQVZuQixDQUFBOztBQUFBLE9BbUJPLENBQUMsV0FBUixHQUFzQixTQUFBLEdBQUE7U0FDcEIsazNEQURvQjtBQUFBLENBbkJ0QixDQUFBOztBQUFBLFVBaURBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFBO0FBQUEsRUFB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QUEsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLDZFQUFBLEdBQWdGLEdBQTVGLENBQUEsQ0FIRjtPQURGO0tBM0JBO0FBaUNBLElBQUEsSUFBRyxVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsTUFBNUIsRUFBb0Msa0RBQXBDLEVBQXdGLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBM0csQ0FBSDtBQUNFLE1BQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxlQUFuQixHQUFxQyxZQUFBLENBQWEsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFoQyxFQUF3QyxZQUFZLENBQUMsS0FBSyxDQUFDLGVBQTNELENBQXJDLENBREY7S0FqQ0E7QUFvQ0EsSUFBQSxJQUFHLFVBQVUsQ0FBQyxnQkFBWCxDQUE0QixNQUE1QixFQUFvQyxlQUFwQyxFQUFxRCxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQXhFLENBQUg7QUFDRSxNQUFBLElBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxZQUFuQixLQUFtQyxNQUF0QztBQUNFLFFBQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxlQUFuQixHQUFxQyxPQUFyQyxDQURGO09BQUEsTUFFSyxJQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsWUFBbkIsS0FBbUMsVUFBdEM7QUFDSCxRQUFBLFlBQVksQ0FBQyxLQUFLLENBQUMsZUFBbkIsR0FBcUMsS0FBckMsQ0FERztPQUFBLE1BQUE7QUFHSCxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQWEsd0ZBQUEsR0FBdUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxZQUF2SCxDQUFBLENBSEc7T0FIUDtLQXJDRjtHQUpBO1NBaURBLE9BbERpQjtBQUFBLENBbkZuQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyMjIyBNb2R1bGUgQ29uZmlndXJhdGlvblxuXG5cInVzZSBzdHJpY3RcIlxuXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbmZzID0gcmVxdWlyZShcImZzXCIpXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbndyZW5jaCA9IHJlcXVpcmUoXCJ3cmVuY2hcIilcbmNyeXB0byA9IHJlcXVpcmUgJ2NyeXB0bydcbmNvbXBpbGVWYXVsdCA9IHJlcXVpcmUgJy4vcGx1Z2luJ1xuXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuXG5leHBvcnRzLmRlZmF1bHRzID0gLT5cbiAgdmF1bHQ6XG4gICAgZXh0ZW5zaW9uUmVnZXg6IC8udmF1bHQuW2EtekEtWl0rJC9cbiAgICBwYXNzd29yZEdlbmVyYXRpb25TZWNyZXQ6IG51bGxcbiAgICBlbmNyeXB0aW9uU2VjcmV0OiBudWxsXG4gICAgb3V0cHV0Rm9ybWF0OiBcImpzb25cIlxuICAgIG1pbW9zYVBhc3N3b3Jkczoge31cbiAgICBlbmZvcmNlRmlsZVBlcm1pc3Npb25zOiB0cnVlXG5cbmV4cG9ydHMucGxhY2Vob2xkZXIgPSAtPlxuICBcIlwiXCJcbiAgXFx0XG4gICAgdmF1bHQ6XG4gICAgICBleHRlbnNpb25SZWdleDogLy52YXVsdC5bYS16QS1aXSskLyAgICAjIHJlZ2V4IGluZGljYXRpbmcgZmlsZSBleHRlbnNpb25zIHRoaXMgbW9kdWxlIHNob3VsZCBwcm9jZXNzXG5cbiAgICAgIHBhc3N3b3JkR2VuZXJhdGlvblNlY3JldDogbnVsbCAgICAjIHBhdGggdG8gc2VjcmV0IHBhc3NwaHJhc2Ugd2hpY2ggc2hvdWxkIGJlIHVzZWQgdG8gZGVyaXZlIHRoZSBzZWNyZXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyAtLSBzaG91bGQgcmVmZXIgdG8gYSBmaWxlIGF0IGEgcGF0aCBvdXRzaWRlIG9mIHRoZSBwcm9qZWN0IHNvdXJjZSBjb250cm9sIC0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBudWxsLCBtaW1vc2Egd2lsbCB1c2UgdGhlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIC5taW1vc2EvdmF1bHQve2FwcH0ua2V5IHdpdGhpbiB0aGUgcHJvamVjdCBkaXJlY3Rvcnkgd2hlcmUge2FwcH0gaXMgdGhlIG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIG9mIHRoZSBwcm9qZWN0IGFzIGdpdmVuIGluIHRoZSBwYWNrYWdlLmpzb24gZmlsZVxuXG4gICAgICBlbmNyeXB0aW9uU2VjcmV0OiBudWxsICAgICAgICAjIFBhdGggdG8gc2VjcmV0IHBhc3NwaHJhc2Ugd2hpY2ggc2hvdWxkIGJlIHVzZWQgdG8gZW5jcnlwdCB0aGUgZ2VuZXJhdGVkIGZpbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGlmIGxlZnQgbnVsbCwgdGhlIG91dHB1dCBmaWxlcyB3aWxsIG5vdCBiZSBlbmNyeXB0ZWQuICBJZiBkZWZpbmVkIGFuZCBhIGZpbGUgZG9lc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBub3QgZXhpc3QgYXQgdmF1bHQuZW5jcnlwdGlvblNlY3JldCBtaW1vc2EtdmF1bHQgd2lsbCBjcmVhdGUgYSBuZXcgc2VjcmV0IHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGVuY3J5cHQgdGhlIG91dHB1dCB3aXRoXG5cbiAgICAgIG91dHB1dEZvcm1hdDogXCJqc29uXCIgICAgICAgICAgIyBzcGVjaWZ5IHRoZSBvdXRwdXQgZm9ybWF0IC0tIGVpdGhlciBqc29uIG9yIGNvbW1vbmpzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBjb21tb25qcywgbW9kdWxlIHdpbGwgZXhwb3J0IGEgc2luZ2xlIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlIHZhdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGlmIGVuY3J5cHRpb24gaXMgdXNlZCB0aGUgZnVuY3Rpb24gd2lsbCBleHBlY3QgdG8gYmUgcGFzc2VkIHRoZSBzZWNyZXQgbmVlZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHRvIGRlY3J5cHQgdGhlIHZhdWx0IC0tIHRoZSBmdW5jdGlvbiByZXR1cm5zIGRlY3J5cHRlZCB2YXVsdCBvciB0aHJvd3MgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgaWYgdGhlIHZhdWx0IHdpdGggdGhlIHN1cHBsaWVkIHBhc3N3b3JkXG5cbiAgICAgIG1pbW9zYVBhc3N3b3Jkczoge30gICAgICAgICAgICMgcGFzc3dvcmRzIHdoaWNoIHNob3VsZCBiZSBtYWRlIGF2YWlsYWJsZSB0byBvdGhlciBtaW1vc2EtbW9kdWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBhdCBtaW1vc2FDb25maWcudmF1bHQubWltb3NhUGFzc3dvcmRzXG5cbiAgICAgIGVuZm9yY2VGaWxlUGVybWlzc2lvbnM6IHRydWUgICMgd2lsbCBjaG1vZCB2YXVsdC5zZWNyZXQgYW5kIGdlbmVyYXRlZCBmaWxlcyB0byBlbnN1cmUgdGhleSBhcmUgcmVhZGFibGUgYnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZmlsZSBvd25lciBvbmx5XG4gIFwiXCJcIlxuXG5fZ2VuU2VjcmV0ID0gKCkgLT5cbiAgc2VlZCA9IGNyeXB0by5yYW5kb21CeXRlcygxMDApXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShzZWVkKS5kaWdlc3QoJ2hleCcpXG5cbl9tb2RpZnlQZXJtaXNzaW9ucyA9IChwYXNzd29yZEdlbmVyYXRpb25TZWNyZXQsIG1pbW9zYUNvbmZpZykgLT5cbiAgaWYgbWltb3NhQ29uZmlnLnZhdWx0LmVuZm9yY2VGaWxlUGVybWlzc2lvbnNcbiAgICBtaW1vc2FDb25maWcubG9nLmluZm8oXCJTZXR0aW5nIHBlcm1pc3Npb25zIG9uIHZhdWx0IHNlY3JldCBmaWxlIFtbICN7cGFzc3dvcmRHZW5lcmF0aW9uU2VjcmV0fSBdXSB0byBvd25lciByZWFkL3dyaXRlIG9ubHlcIilcbiAgICBmcy5jaG1vZFN5bmMocGFzc3dvcmRHZW5lcmF0aW9uU2VjcmV0LCAwbzYwMClcblxuX3JlYWRPckNyZWF0ZVNlY3JldCA9IChzZWNyZXQsIG1pbW9zYUNvbmZpZykgLT5cbiAgbG9nZ2VyID0gbWltb3NhQ29uZmlnLmxvZ1xuXG4gIGlmIGZzLmV4aXN0c1N5bmMoc2VjcmV0KVxuICAgIF9tb2RpZnlQZXJtaXNzaW9ucyhzZWNyZXQsIG1pbW9zYUNvbmZpZylcblxuICAgIGxvZ2dlci5pbmZvIFwiUmVhZGluZyB2YXVsdCBzZWNyZXQgYXQgW1sgI3tzZWNyZXR9IF1dXCJcbiAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHNlY3JldCwgXCJhc2NpaVwiKVxuICBlbHNlXG4gICAgd3JlbmNoLm1rZGlyU3luY1JlY3Vyc2l2ZShwYXRoLmRpcm5hbWUoc2VjcmV0KSwgMG83MDApXG5cbiAgICBmcy5vcGVuU3luYyhzZWNyZXQsICd3JylcbiAgICBfbW9kaWZ5UGVybWlzc2lvbnMoc2VjcmV0LCBtaW1vc2FDb25maWcpXG5cbiAgICBuZXdLZXkgPSBfZ2VuU2VjcmV0KClcblxuICAgIGZzLndyaXRlRmlsZSBzZWNyZXQsIG5ld0tleSwgJ2FzY2lpJywgKGVycikgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICB0aHJvdyBcIkVycm9yIHdyaXRpbmcga2V5IHRvIGZpbGUgW1sgI3tzZWNyZXR9IF1dOiAje2Vycn1cIlxuICAgICAgZWxzZVxuICAgICAgICBsb2dnZXIuc3VjY2VzcyBcIk5ldyB2YXVsdCBzZWNyZXQgd3JpdHRlbiB0byBbWyAje3NlY3JldH0gXV1cIlxuXG5cbiAgcmV0dXJuIG5ld0tleVxuXG5leHBvcnRzLnZhbGlkYXRlID0gKG1pbW9zYUNvbmZpZywgdmFsaWRhdG9ycykgLT5cbiAgZXJyb3JzID0gW11cblxuICBtaW1vc2FDb25maWcubG9nLmRlYnVnKCd2YWxpZGF0aW5nIHZhdWx0JylcblxuICBpZiB2YWxpZGF0b3JzLmlmRXhpc3RzSXNPYmplY3QoZXJyb3JzLCBcInZhdWx0IG1pbW9zYUNvbmZpZ1wiLCBtaW1vc2FDb25maWcudmF1bHQpXG4gICAgdW5sZXNzIG1pbW9zYUNvbmZpZy52YXVsdC5leHRlbnNpb25SZWdleCBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgZXJyb3JzLnB1c2ggXCJ2YXVsdC5leHRlbnNpb25SZWdleCBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFJlZ0V4cFwiXG5cbiAgICB2YWxpZGF0b3JzLmlmRXhpc3RzSXNCb29sZWFuKGVycm9ycywgXCJlbmZvcmNlIHBlcm1pc3Npb25zXCIsIG1pbW9zYUNvbmZpZy52YXVsdC5lbmZvcmNlRmlsZVBlcm1pc3Npb25zKVxuXG4gICAgcGFzc3dvcmRHZW5lcmF0aW9uU2VjcmV0ID0gbWltb3NhQ29uZmlnLnZhdWx0LnBhc3N3b3JkR2VuZXJhdGlvblNlY3JldFxuICAgICMgZ2VuZXJhdGUgZGVmYXVsdCBwYXRoIGZvciBwYXNzd29yZEdlbmVyYXRpb25TZWNyZXQgaWYgb25lIGlzIG5vdCBzcGVjaWZpZWRcbiAgICBpZiBwYXNzd29yZEdlbmVyYXRpb25TZWNyZXQgaXMgbnVsbFxuICAgICAgdHJ5XG4gICAgICAgIHBhY2thZ2VOYW1lID0gcmVxdWlyZShwYXRoLmpvaW4gbWltb3NhQ29uZmlnLnJvb3QsICdwYWNrYWdlLmpzb24nKS5uYW1lXG4gICAgICAgIHBhc3N3b3JkR2VuZXJhdGlvblNlY3JldCA9IHBhdGguam9pbihtaW1vc2FDb25maWcucm9vdCwgXCIubWltb3NhL3ZhdWx0LyN7cGFja2FnZU5hbWV9LXBhc3N3b3JkR2VuZXJhdGlvbi5rZXlcIilcbiAgICAgIGNhdGNoIGVyclxuICAgICAgICBlcnJvcnMucHVzaChcIkNvdWxkIG5vdCBmaW5kIHBhY2thZ2UuanNvbiBvciBwYWNrYWdlLmpzb24gZGlkIG5vdCBzcGVjaWZ5IG5hbWUgLS0gcHJvamVjdCBuYW1lIGlzIG5lZWRlZCB0byBmaW5kIHZhdWx0IHNzaCBrZXlcIilcbiAgICAgICAgZXJyb3JzXG5cbiAgICAjIHJlYWQgdGhlIHBhc3N3b3JkR2VuZXJhdGlvbktleSBvciBjcmVhdGUgb25lIGlmIG9uZSBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0XG4gICAgdHJ5XG4gICAgICBtaW1vc2FDb25maWcudmF1bHQucGFzc3dvcmRHZW5lcmF0aW9uU2VjcmV0ID0gX3JlYWRPckNyZWF0ZVNlY3JldChwYXNzd29yZEdlbmVyYXRpb25TZWNyZXQsIG1pbW9zYUNvbmZpZylcbiAgICBjYXRjaCBlcnJcbiAgICAgIGVycm9ycy5wdXNoKFwibWltb3NhQ29uZmlnIGVycm9yIC0tIGNvdWxkIG5vdCByZWFkIGZpbGUgZ2l2ZW4gYnkgdmF1bHQucGFzc3dvcmRHZW5lcmF0aW9uU2VjcmV0OiBcIiArIGVycilcblxuICAgICMgaGFuZGxlIGNhc2Ugd2hlcmUgZW5jcnlwdGlvblNlY3JldCA9PT0gdHJ1ZVxuICAgIGVuY3J5cHRpb25TZWNyZXQgPSBtaW1vc2FDb25maWcudmF1bHQuZW5jcnlwdGlvblNlY3JldFxuICAgIGlmIF8uaXNCb29sZWFuKGVuY3J5cHRpb25TZWNyZXQpIGFuZCBlbmNyeXB0aW9uU2VjcmV0XG4gICAgICBlbmNyeXB0aW9uU2VjcmV0ID0gcGF0aC5qb2luKG1pbW9zYUNvbmZpZy5yb290LCBcIi5taW1vc2EvdmF1bHQvI3twYWNrYWdlTmFtZX0tZW5jcnlwdGlvbi5rZXlcIilcblxuICAgICMgaWYgZW5jcnlwdGlvblNlY3JldCBpcyBkZWZpbmVkLCBpdCBzaG91bGQgc3BlY2lmeSBhIHBhdGhcbiAgICBpZiBlbmNyeXB0aW9uU2VjcmV0P1xuICAgICAgdHJ5XG4gICAgICAgIG1pbW9zYUNvbmZpZy52YXVsdC5lbmNyeXB0aW9uU2VjcmV0ID0gX3JlYWRPckNyZWF0ZVNlY3JldChlbmNyeXB0aW9uU2VjcmV0LCBtaW1vc2FDb25maWcpXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgZXJyb3JzLnB1c2goXCJtaW1vc2FDb25maWcgZXJyb3IgLS0gY291bGQgbm90IHJlYWQgZmlsZSBnaXZlbiBieSB2YXVsdC5lbmNyeXB0aW9uU2VjcmV0OiBcIiArIGVycilcblxuICAgIGlmIHZhbGlkYXRvcnMuaWZFeGlzdHNJc09iamVjdChlcnJvcnMsIFwidmF1bHQgZGVyaXZlZCBwYXNzd29yZHMgZm9yIG90aGVyIG1pbW9zYSBtb2R1bGVzXCIsIG1pbW9zYUNvbmZpZy52YXVsdC5taW1vc2FQYXNzd29yZHMpXG4gICAgICBtaW1vc2FDb25maWcudmF1bHQubWltb3NhUGFzc3dvcmRzID0gY29tcGlsZVZhdWx0KG1pbW9zYUNvbmZpZy52YXVsdC5zZWNyZXQsIG1pbW9zYUNvbmZpZy52YXVsdC5taW1vc2FQYXNzd29yZHMpXG5cbiAgICBpZiB2YWxpZGF0b3JzLmlmRXhpc3RzSXNTdHJpbmcoZXJyb3JzLCBcIm91dHB1dCBmb3JtYXRcIiwgbWltb3NhQ29uZmlnLnZhdWx0Lm91dHB1dEZvcm1hdClcbiAgICAgIGlmIG1pbW9zYUNvbmZpZy52YXVsdC5vdXRwdXRGb3JtYXQgPT0gXCJqc29uXCJcbiAgICAgICAgbWltb3NhQ29uZmlnLnZhdWx0Lm91dHB1dEV4dGVuc2lvbiA9IFwiLmpzb25cIlxuICAgICAgZWxzZSBpZiBtaW1vc2FDb25maWcudmF1bHQub3V0cHV0Rm9ybWF0ID09IFwiY29tbW9uanNcIlxuICAgICAgICBtaW1vc2FDb25maWcudmF1bHQub3V0cHV0RXh0ZW5zaW9uID0gXCIuanNcIlxuICAgICAgZWxzZVxuICAgICAgICBlcnJvcnMucHVzaChcIm1pbW9zYS1jb25maWcgZXJyb3IgLS0gdmF1bHQub3V0cHV0Rm9ybWF0IHNob3VsZCBiZSBvbmUgb2YgJ2pzb24nIG9yICdjb21tb25qcycgZm91bmQgI3ttaW1vc2FDb25maWcudmF1bHQub3V0cHV0Rm9ybWF0fVwiKVxuXG4gIGVycm9ycyJdfQ==
