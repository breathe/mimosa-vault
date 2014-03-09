"use strict";
var compileVault, crypto, fs, path, wrench, _genSecret, _modifyPermissions, _readSecret;

path = require("path");

fs = require("fs");

path = require("path");

wrench = require("wrench");

crypto = require('crypto');

compileVault = require('./plugin');

exports.defaults = function() {
  return {
    vault: {
      extensionRegex: /.vault.[a-zA-Z]+$/,
      secret: null,
      outputExtension: ".json",
      buildSecrets: {},
      enforcePermissions: true
    }
  };
};

exports.placeholder = function() {
  return "\t\n  vault:\n    extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process\n\n    secret: null                  # path to secret passphrase which should be used to derive the secrets\n                                  # -- should refer to a file at a path outside of the project source control --\n                                  # if null, mimosa will use the path\n                                  # .mimosa/vault/{app}.key within the project directory where {app} is the name of\n                                  # the project as given in the package.json file\n\n    outputExtension: \".json\"      # outputted is formatted as json -- write json file by default\n\n    mimosaSecrets: {}             # secrets which should be derived for the build process and made\n                                  # available for other mimosa-modules as mimosaConfig.vault.mimosaSecrets\n    enforcePermissions: true      # will chmod vault.secret and generated files to ensure they are readable by\n                                  # file owner only";
};

_genSecret = function() {
  var seed;
  seed = crypto.randomBytes(100);
  return crypto.createHash('sha1').update(seed).digest('hex');
};

_modifyPermissions = function(secretPath, mimosaConfig) {
  if (mimosaConfig.vault.enforcePermissions) {
    mimosaConfig.log.info("Setting permissions on vault secret file [[ " + secretPath + " ]] to owner read/write only");
    return fs.chmodSync(secretPath, 0x180);
  }
};

_readSecret = function(secretPath, mimosaConfig) {
  var logger, newKey;
  logger = mimosaConfig.log;
  if (fs.existsSync(secretPath)) {
    _modifyPermissions(secretPath, mimosaConfig);
    logger.info("Reading vault secret at [[ " + secretPath + " ]]");
    return fs.readFileSync(secretPath, "ascii");
  } else {
    wrench.mkdirSyncRecursive(path.dirname(secretPath), 0x1c0);
    fs.openSync(secretPath, 'w');
    _modifyPermissions(secretPath, mimosaConfig);
    newKey = _genSecret();
    fs.writeFile(secretPath, newKey, 'ascii', function(err) {
      if (err) {
        throw "Error writing key to file [[ " + secretPath + " ]]: " + err;
      } else {
        return logger.success("New vault secret written to [[ " + secretPath + " ]]");
      }
    });
  }
  return newKey;
};

exports.validate = function(mimosaConfig, validators) {
  var err, errors, packageName, secretPath, _ref;
  errors = [];
  mimosaConfig.log.debug('validating vault');
  if (validators.ifExistsIsObject(errors, "vault mimosaConfig", mimosaConfig.vault)) {
    if (!(mimosaConfig.vault.extensionRegex instanceof RegExp)) {
      errors.push("vault.extensionRegex must be an instance of RegExp");
    }
    validators.ifExistsIsBoolean(errors, "enforce permissions", mimosaConfig.vault.enforcePermissions);
    secretPath = mimosaConfig.vault.secret;
    if (secretPath === null) {
      try {
        packageName = require(path.join(mimosaConfig.root, 'package.json')).name;
        secretPath = path.join(mimosaConfig.root, ".mimosa/vault/" + packageName + ".key");
      } catch (_error) {
        err = _error;
        errors.push("Could not find package.json or package.json did not specify name -- project name is needed to find vault ssh key");
        errors;
      }
    }
    if (!((_ref = mimosaConfig.vault) != null ? _ref._generateKey : void 0)) {
      try {
        mimosaConfig.vault.secret = _readSecret(secretPath, mimosaConfig);
      } catch (_error) {
        err = _error;
        errors.push("mimosaConfig error -- could not read file given by vault.secret: " + err);
      }
    }
    if (validators.ifExistsIsObject(errors, "build secrets", mimosaConfig.vault.mimosaSecrets)) {
      mimosaConfig.vault.mimosaSecrets = compileVault(mimosaConfig.vault.secret, mimosaConfig.vault.mimosaSecrets);
    }
  }
  return errors;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLFlBQUEsQ0FBQTtBQUFBLElBQUEsbUZBQUE7O0FBQUEsSUFFQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLElBSUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsTUFLQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBTFQsQ0FBQTs7QUFBQSxNQU1BLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FOVCxDQUFBOztBQUFBLFlBT0EsR0FBZSxPQUFBLENBQVEsVUFBUixDQVBmLENBQUE7O0FBQUEsT0FTTyxDQUFDLFFBQVIsR0FBbUIsU0FBQSxHQUFBO1NBQ2pCO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFBZ0IsbUJBQWhCO0FBQUEsTUFDQSxNQUFBLEVBQVEsSUFEUjtBQUFBLE1BRUEsZUFBQSxFQUFpQixPQUZqQjtBQUFBLE1BR0EsWUFBQSxFQUFjLEVBSGQ7QUFBQSxNQUlBLGtCQUFBLEVBQW9CLElBSnBCO0tBREY7SUFEaUI7QUFBQSxDQVRuQixDQUFBOztBQUFBLE9BaUJPLENBQUMsV0FBUixHQUFzQixTQUFBLEdBQUE7U0FDcEIsbWtDQURvQjtBQUFBLENBakJ0QixDQUFBOztBQUFBLFVBcUNBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLFdBQVAsQ0FBbUIsR0FBbkIsQ0FBUCxDQUFBO0FBQ0EsU0FBTyxNQUFNLENBQUMsVUFB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QUMsSUFBdkIsRUFBNkIsY0FBN0IsQ0FBUixDQUFvRCxDQUFDLElBQW5FLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVksQ0FBQyxJQUF2QixFQUE4QixnQkFBQSxHQUFlLFdBQWYsR0FBNEIsTUFBMUQsQ0FEYixDQURGO09BQUEsY0FBQTtBQUlFLFFBREksWUFDSixDQUFBO0FBQUEsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLGtIQUFaLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFEQSxDQUpGO09BREY7S0FOQTtBQWNBLElBQUEsSUFBRyxDQUFBLDJDQUFzQixDQUFFLHNCQUEzQjtBQUNFO0FBQ0UsUUFBQSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQW5CLEdBQTRCLFdBQUEsQ0FBWSxVQUFaLEVBQXdCLFlBQXhCLENBQTVCLENBREY7T0FBQSxjQUFBO0FBR0UsUUFESSxZQUNKLENBQUE7QUFBQSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksbUVBQUEsR0FBc0UsR0FBbEYsQ0FBQSxDQUhGO09BREY7S0FkQTtBQW9CQSxJQUFBLElBQUcsVUFBVSxDQUFDLGdCQUFYLENBQTRCLE1BQTVCLEVBQW9DLGVBQXBDLEVBQXFELFlBQVksQ0FBQyxLQUFLLENBQUMsYUFBeEUsQ0FBSDtBQUNFLE1BQUEsWUFBWSxDQUFDLEtBQUssQ0FBQyxhQUFuQixHQUFtQyxZQUFBLENBQWEsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFoQyxFQUF3QyxZQUFZLENBQUMsS0FBSyxDQUFDLGFBQTNELENBQW5DLENBREY7S0FyQkY7R0FKQTtTQTRCQSxPQTdCaUI7QUFBQSxDQXZFbkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIiMjIyMgTW9kdWxlIENvbmZpZ3VyYXRpb25cblxuXCJ1c2Ugc3RyaWN0XCJcblxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG53cmVuY2ggPSByZXF1aXJlKFwid3JlbmNoXCIpXG5jcnlwdG8gPSByZXF1aXJlICdjcnlwdG8nXG5jb21waWxlVmF1bHQgPSByZXF1aXJlICcuL3BsdWdpbidcblxuZXhwb3J0cy5kZWZhdWx0cyA9IC0+XG4gIHZhdWx0OlxuICAgIGV4dGVuc2lvblJlZ2V4OiAvLnZhdWx0LlthLXpBLVpdKyQvXG4gICAgc2VjcmV0OiBudWxsXG4gICAgb3V0cHV0RXh0ZW5zaW9uOiBcIi5qc29uXCJcbiAgICBidWlsZFNlY3JldHM6IHt9XG4gICAgZW5mb3JjZVBlcm1pc3Npb25zOiB0cnVlXG5cbmV4cG9ydHMucGxhY2Vob2xkZXIgPSAtPlxuICBcIlwiXCJcbiAgXFx0XG4gICAgdmF1bHQ6XG4gICAgICBleHRlbnNpb25SZWdleDogLy52YXVsdC5bYS16QS1aXSskLyAgICAjIHJlZ2V4IGluZGljYXRpbmcgZmlsZSBleHRlbnNpb25zIHRoaXMgbW9kdWxlIHNob3VsZCBwcm9jZXNzXG5cbiAgICAgIHNlY3JldDogbnVsbCAgICAgICAgICAgICAgICAgICMgcGF0aCB0byBzZWNyZXQgcGFzc3BocmFzZSB3aGljaCBzaG91bGQgYmUgdXNlZCB0byBkZXJpdmUgdGhlIHNlY3JldHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgLS0gc2hvdWxkIHJlZmVyIHRvIGEgZmlsZSBhdCBhIHBhdGggb3V0c2lkZSBvZiB0aGUgcHJvamVjdCBzb3VyY2UgY29udHJvbCAtLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBpZiBudWxsLCBtaW1vc2Egd2lsbCB1c2UgdGhlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgLm1pbW9zYS92YXVsdC97YXBwfS5rZXkgd2l0aGluIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSB3aGVyZSB7YXBwfSBpcyB0aGUgbmFtZSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyB0aGUgcHJvamVjdCBhcyBnaXZlbiBpbiB0aGUgcGFja2FnZS5qc29uIGZpbGVcblxuICAgICAgb3V0cHV0RXh0ZW5zaW9uOiBcIi5qc29uXCIgICAgICAjIG91dHB1dHRlZCBpcyBmb3JtYXR0ZWQgYXMganNvbiAtLSB3cml0ZSBqc29uIGZpbGUgYnkgZGVmYXVsdFxuXG4gICAgICBtaW1vc2FTZWNyZXRzOiB7fSAgICAgICAgICAgICAjIHNlY3JldHMgd2hpY2ggc2hvdWxkIGJlIGRlcml2ZWQgZm9yIHRoZSBidWlsZCBwcm9jZXNzIGFuZCBtYWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIGF2YWlsYWJsZSBmb3Igb3RoZXIgbWltb3NhLW1vZHVsZXMgYXMgbWltb3NhQ29uZmlnLnZhdWx0Lm1pbW9zYVNlY3JldHNcbiAgICAgIGVuZm9yY2VQZXJtaXNzaW9uczogdHJ1ZSAgICAgICMgd2lsbCBjaG1vZCB2YXVsdC5zZWNyZXQgYW5kIGdlbmVyYXRlZCBmaWxlcyB0byBlbnN1cmUgdGhleSBhcmUgcmVhZGFibGUgYnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgZmlsZSBvd25lciBvbmx5XG4gIFwiXCJcIlxuXG5fZ2VuU2VjcmV0ID0gKCkgLT5cbiAgc2VlZCA9IGNyeXB0by5yYW5kb21CeXRlcygxMDApXG4gIHJldHVybiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShzZWVkKS5kaWdlc3QoJ2hleCcpXG5cbl9tb2RpZnlQZXJtaXNzaW9ucyA9IChzZWNyZXRQYXRoLCBtaW1vc2FDb25maWcpIC0+XG4gIGlmIG1pbW9zYUNvbmZpZy52YXVsdC5lbmZvcmNlUGVybWlzc2lvbnNcbiAgICBtaW1vc2FDb25maWcubG9nLmluZm8oXCJTZXR0aW5nIHBlcm1pc3Npb25zIG9uIHZhdWx0IHNlY3JldCBmaWxlIFtbICN7c2VjcmV0UGF0aH0gXV0gdG8gb3duZXIgcmVhZC93cml0ZSBvbmx5XCIpXG4gICAgZnMuY2htb2RTeW5jKHNlY3JldFBhdGgsIDBvNjAwKVxuXG5fcmVhZFNlY3JldCA9IChzZWNyZXRQYXRoLCBtaW1vc2FDb25maWcpIC0+XG4gIGxvZ2dlciA9IG1pbW9zYUNvbmZpZy5sb2dcblxuICBpZiBmcy5leGlzdHNTeW5jKHNlY3JldFBhdGgpXG4gICAgX21vZGlmeVBlcm1pc3Npb25zKHNlY3JldFBhdGgsIG1pbW9zYUNvbmZpZylcblxuICAgIGxvZ2dlci5pbmZvIFwiUmVhZGluZyB2YXVsdCBzZWNyZXQgYXQgW1sgI3tzZWNyZXRQYXRofSBdXVwiXG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhzZWNyZXRQYXRoLCBcImFzY2lpXCIpXG4gIGVsc2VcbiAgICB3cmVuY2gubWtkaXJTeW5jUmVjdXJzaXZlKHBhdGguZGlybmFtZShzZWNyZXRQYXRoKSwgMG83MDApXG5cbiAgICBmcy5vcGVuU3luYyhzZWNyZXRQYXRoLCAndycpXG4gICAgX21vZGlmeVBlcm1pc3Npb25zKHNlY3JldFBhdGgsIG1pbW9zYUNvbmZpZylcblxuICAgIG5ld0tleSA9IF9nZW5TZWNyZXQoKVxuXG4gICAgZnMud3JpdGVGaWxlIHNlY3JldFBhdGgsIG5ld0tleSwgJ2FzY2lpJywgKGVycikgLT5cbiAgICAgIGlmIGVyclxuICAgICAgICB0aHJvdyBcIkVycm9yIHdyaXRpbmcga2V5IHRvIGZpbGUgW1sgI3tzZWNyZXRQYXRofSBdXTogI3tlcnJ9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgbG9nZ2VyLnN1Y2Nlc3MgXCJOZXcgdmF1bHQgc2VjcmV0IHdyaXR0ZW4gdG8gW1sgI3tzZWNyZXRQYXRofSBdXVwiXG5cblxuICByZXR1cm4gbmV3S2V5XG5cbmV4cG9ydHMudmFsaWRhdGUgPSAobWltb3NhQ29uZmlnLCB2YWxpZGF0b3JzKSAtPlxuICBlcnJvcnMgPSBbXVxuXG4gIG1pbW9zYUNvbmZpZy5sb2cuZGVidWcoJ3ZhbGlkYXRpbmcgdmF1bHQnKVxuXG4gIGlmIHZhbGlkYXRvcnMuaWZFeGlzdHNJc09iamVjdChlcnJvcnMsIFwidmF1bHQgbWltb3NhQ29uZmlnXCIsIG1pbW9zYUNvbmZpZy52YXVsdClcbiAgICB1bmxlc3MgbWltb3NhQ29uZmlnLnZhdWx0LmV4dGVuc2lvblJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwXG4gICAgICBlcnJvcnMucHVzaCBcInZhdWx0LmV4dGVuc2lvblJlZ2V4IG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgUmVnRXhwXCJcblxuICAgIHZhbGlkYXRvcnMuaWZFeGlzdHNJc0Jvb2xlYW4oZXJyb3JzLCBcImVuZm9yY2UgcGVybWlzc2lvbnNcIiwgbWltb3NhQ29uZmlnLnZhdWx0LmVuZm9yY2VQZXJtaXNzaW9ucylcblxuICAgIHNlY3JldFBhdGggPSBtaW1vc2FDb25maWcudmF1bHQuc2VjcmV0XG4gICAgaWYgc2VjcmV0UGF0aCBpcyBudWxsXG4gICAgICB0cnlcbiAgICAgICAgcGFja2FnZU5hbWUgPSByZXF1aXJlKHBhdGguam9pbiBtaW1vc2FDb25maWcucm9vdCwgJ3BhY2thZ2UuanNvbicpLm5hbWVcbiAgICAgICAgc2VjcmV0UGF0aCA9IHBhdGguam9pbihtaW1vc2FDb25maWcucm9vdCwgXCIubWltb3NhL3ZhdWx0LyN7cGFja2FnZU5hbWV9LmtleVwiKVxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIGVycm9ycy5wdXNoKFwiQ291bGQgbm90IGZpbmQgcGFja2FnZS5qc29uIG9yIHBhY2thZ2UuanNvbiBkaWQgbm90IHNwZWNpZnkgbmFtZSAtLSBwcm9qZWN0IG5hbWUgaXMgbmVlZGVkIHRvIGZpbmQgdmF1bHQgc3NoIGtleVwiKVxuICAgICAgICBlcnJvcnNcblxuICAgIGlmIG5vdCBtaW1vc2FDb25maWcudmF1bHQ/Ll9nZW5lcmF0ZUtleVxuICAgICAgdHJ5XG4gICAgICAgIG1pbW9zYUNvbmZpZy52YXVsdC5zZWNyZXQgPSBfcmVhZFNlY3JldChzZWNyZXRQYXRoLCBtaW1vc2FDb25maWcpXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgZXJyb3JzLnB1c2goXCJtaW1vc2FDb25maWcgZXJyb3IgLS0gY291bGQgbm90IHJlYWQgZmlsZSBnaXZlbiBieSB2YXVsdC5zZWNyZXQ6IFwiICsgZXJyKVxuXG4gICAgaWYgdmFsaWRhdG9ycy5pZkV4aXN0c0lzT2JqZWN0KGVycm9ycywgXCJidWlsZCBzZWNyZXRzXCIsIG1pbW9zYUNvbmZpZy52YXVsdC5taW1vc2FTZWNyZXRzKVxuICAgICAgbWltb3NhQ29uZmlnLnZhdWx0Lm1pbW9zYVNlY3JldHMgPSBjb21waWxlVmF1bHQobWltb3NhQ29uZmlnLnZhdWx0LnNlY3JldCwgbWltb3NhQ29uZmlnLnZhdWx0Lm1pbW9zYVNlY3JldHMpXG5cbiAgZXJyb3JzIl19
