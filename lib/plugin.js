var Vault, compileVault, _, _checkVault, _checkVaultOptions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('underscore');

Vault = require('vault');

_checkVault = function(obj) {
  var err;
  err = "module.exports:";
  if (_.isArray(obj)) {
    throw "" + err + " expected object -- found array";
  }
  if (_.isFunction(obj)) {
    throw "" + err + " expected object -- found function";
  }
  if (!_.isObject(obj)) {
    throw "" + err + " expected object -- found " + (typeof obj);
  }
};

_checkVaultOptions = function(name, options) {
  var ALLOWED_OPTIONS, i, key, value;
  ALLOWED_OPTIONS = (function() {
    var _i, _len, _ref, _results;
    _ref = _.union(Vault.TYPES, ['length', 'repeat', 'revision']);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.toLowerCase());
    }
    return _results;
  })();
  options || (options = {});
  if (!_.isObject(options) || _.isArray(options) || _.isFunction(options)) {
    throw "error with value of key: " + name + " -- should be object with keys from " + ALLOWED_OPTIONS;
  }
  for (key in options) {
    value = options[key];
    if (__indexOf.call(ALLOWED_OPTIONS, key) < 0) {
      throw "error with " + name + " -- invalid option " + key + " supplied";
    } else {
      if (_.isNaN(parseInt(value))) {
        throw "error with " + name + "[\"" + key + "\"] -- expected Number - found " + key;
      }
    }
  }
  if (options.revision != null) {
    name = "" + name + "-" + options.revision;
  }
  return [name, options];
};

compileVault = function(secret, vault_request) {
  var password, service_name, service_revision_name, service_settings, settings, vault, vault_transformed, _ref;
  _checkVault(vault_request);
  vault_transformed = {};
  for (service_name in vault_request) {
    service_settings = vault_request[service_name];
    _ref = _checkVaultOptions(service_name, service_settings), service_revision_name = _ref[0], service_settings = _ref[1];
    settings = _.extend({}, service_settings, {
      phrase: secret,
      symbol: 0
    });
    vault = new Vault(settings);
    password = vault.generate(service_revision_name);
    vault_transformed[service_name] = password;
  }
  return vault_transformed;
};

module.exports = compileVault;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9wbHVnaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQUEsdURBQUE7RUFBQSxxSkFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FBSixDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsV0FJQSxHQUFjLFNBQUMsR0FBRCxHQUFBO0FBQ1osTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0saUJBQU4sQ0FBQTtBQUNBLEVBQUEsSUFBRyxDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsQ0FBSDtBQUNFLFVBQU0sRUFBQSxHQUFFLEdBQUYsR0FBTyxpQ0FBYixDQURGO0dBREE7QUFHQSxFQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiLENBQUg7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sb0NBQWIsQ0FERjtHQUhBO0FBS0EsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxHQUFYLENBQVA7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sNEJBQVAsR0FBa0MsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUF4QyxDQURGO0dBTlk7QUFBQSxDQUpkLENBQUE7O0FBQUEsa0JBY0EsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBSW5CLE1BQUEsOEJBQUE7QUFBQSxFQUFBLGVBQUE7O0FBQW1CO0FBQUE7U0FBQSwyQ0FBQTttQkFBQTtBQUFBLG9CQUFBLENBQUMsQ0FBQyxXQUFGLENBQUEsRUFBQSxDQUFBO0FBQUE7O01BQW5CLENBQUE7QUFBQSxFQUVBLFlBQUEsVUFBWSxHQUZaLENBQUE7QUFHQSxFQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsUUFBRixDQUFXLE9BQVgsQ0FBSixJQUEyQixDQUFDLENBQUMsT0FBRixDQUFVLE9BQVYsQ0FBM0IsSUFBaUQsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxPQUFiLENBQXBEO0FBQ0UsVUFBTywyQkFBQSxHQUEwQixJQUExQixHQUFnQyxzQ0FBaEMsR0FBcUUsZUFBNUUsQ0FERjtHQUhBO0FBTUEsT0FBQSxjQUFBO3lCQUFBO0FBQ0UsSUFBQSxJQUFHLGVBQVcsZUFBWCxFQUFBLEdBQUEsS0FBSDtBQUNFLFlBQU8sYUFBQSxHQUFZLElBQVosR0FBa0IscUJBQWxCLEdBQXNDLEdBQXRDLEdBQTJDLFdBQWxELENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsUUFBQSxDQUFTLEtBQVQsQ0FBUixDQUFIO0FBQ0UsY0FBTyxhQUFBLEdBQVksSUFBWixHQUFrQixLQUFsQixHQUFzQixHQUF0QixHQUEyQixpQ0FBM0IsR0FBMkQsR0FBbEUsQ0FERjtPQUhGO0tBREY7QUFBQSxHQU5BO0FBYUEsRUFBQSxJQUFHLHdCQUFIO0FBQ0UsSUFBQSxJQUFBLEdBQU8sRUFBQSxHQUFFLElBQUYsR0FBUSxHQUFSLEdBQVUsT0FBTyxDQUFDLFFBQXpCLENBREY7R0FiQTtBQWdCQSxTQUFPLENBQUMsSUFBRCxFQUFPLE9BQVAsQ0FBUCxDQXBCbUI7QUFBQSxDQWRyQixDQUFBOztBQUFBLFlBc0NBLEdBQWUsU0FBQyxNQUFELEVBQVMsYUFBVCxHQUFBO0FBRWIsTUFBQSx5R0FBQTtBQUFBLEVBQUEsV0FBQSxDQUFZLGFBQVosQ0FBQSxDQUFBO0FBQUEsRUFFQSxpQkFBQSxHQUFvQixFQUZwQixDQUFBO0FBSUEsT0FBQSw2QkFBQTttREFBQTtBQUNFLElBQUEsT0FBNEMsa0JBQUEsQ0FBbUIsWUFBbkIsRUFBaUMsZ0JBQWpDLENBQTVDLEVBQUMsK0JBQUQsRUFBd0IsMEJBQXhCLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxnQkFBYixFQUErQjtBQUFBLE1BQUMsTUFBQSxFQUFPLE1BQVI7QUFBQSxNQUFnQixNQUFBLEVBQU8sQ0FBdkI7S0FBL0IsQ0FEWCxDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sUUFBTixDQUZaLENBQUE7QUFBQSxJQUdBLFFBQUEsR0FBVyxLQUFLLENBQUMsUUFBTixDQUFlLHFCQUFmLENBSFgsQ0FBQTtBQUFBLElBSUEsaUJBQWtCLENBQUEsWUFBQSxDQUFsQixHQUFrQyxRQUpsQyxDQURGO0FBQUEsR0FKQTtBQVdBLFNBQU8saUJBQVAsQ0FiYTtBQUFBLENBdENmLENBQUE7O0FBQUEsTUFxRE0sQ0FBQyxPQUFQLEdBQWlCLFlBckRqQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5fID0gcmVxdWlyZSgndW5kZXJzY29yZScpXG5WYXVsdCA9IHJlcXVpcmUoJ3ZhdWx0JylcblxuIyBub2lzaWx5IGVuZm9yY2UgdGhlIHNoYXBlIG9mIHZhdWx0X3JlcXVlc3Qgb2JqZWN0XG5fY2hlY2tWYXVsdCA9IChvYmopIC0+XG4gIGVyciA9IFwibW9kdWxlLmV4cG9ydHM6XCJcbiAgaWYgXy5pc0FycmF5KG9iailcbiAgICB0aHJvdyBcIiN7ZXJyfSBleHBlY3RlZCBvYmplY3QgLS0gZm91bmQgYXJyYXlcIlxuICBpZiBfLmlzRnVuY3Rpb24ob2JqKVxuICAgIHRocm93IFwiI3tlcnJ9IGV4cGVjdGVkIG9iamVjdCAtLSBmb3VuZCBmdW5jdGlvblwiXG4gIGlmIG5vdCBfLmlzT2JqZWN0KG9iailcbiAgICB0aHJvdyBcIiN7ZXJyfSBleHBlY3RlZCBvYmplY3QgLS0gZm91bmQgI3t0eXBlb2Yob2JqKX1cIlxuXG4jIG5vaXNpbHkgdmVyaWZ5IHRoZSBzaGFwZSBvZiB0aGUgb3B0aW9ucyBpbiBlYWNoIHZhdWx0X3JlcXVlc3Rcbl9jaGVja1ZhdWx0T3B0aW9ucyA9IChuYW1lLCBvcHRpb25zKSAtPlxuXG4gICMgcGFzc2luZyAnc3ltYm9sJz4xIHRvIFZhdWx0IGNvbnN0cnVjdG9yIHdvdWxkIGJyZWFrIHRoZSBqc29uIGVuY29kaW5nIG9mIHRoZSBvdXRwdXQgLi4uXG4gICMgZG9uJ3QgYWxsb3cgdXNlciB0byB0dXJuIG9uIHRoZSBzeW1ib2wgb3B0aW9uIGFuZCBjb21wbGFpbiBpZiB0aGV5IGRvXG4gIEFMTE9XRURfT1BUSU9OUyA9IChpLnRvTG93ZXJDYXNlKCkgZm9yIGkgaW4gXy51bmlvbihWYXVsdC5UWVBFUywgWydsZW5ndGgnLCAncmVwZWF0JywgJ3JldmlzaW9uJ10pKVxuXG4gIG9wdGlvbnMgb3I9IHt9XG4gIGlmIG5vdCBfLmlzT2JqZWN0KG9wdGlvbnMpIG9yIF8uaXNBcnJheShvcHRpb25zKSBvciBfLmlzRnVuY3Rpb24ob3B0aW9ucylcbiAgICB0aHJvdyBcImVycm9yIHdpdGggdmFsdWUgb2Yga2V5OiAje25hbWV9IC0tIHNob3VsZCBiZSBvYmplY3Qgd2l0aCBrZXlzIGZyb20gI3tBTExPV0VEX09QVElPTlN9XCJcblxuICBmb3Iga2V5LCB2YWx1ZSBvZiBvcHRpb25zXG4gICAgaWYga2V5IG5vdCBpbiBBTExPV0VEX09QVElPTlNcbiAgICAgIHRocm93IFwiZXJyb3Igd2l0aCAje25hbWV9IC0tIGludmFsaWQgb3B0aW9uICN7a2V5fSBzdXBwbGllZFwiXG4gICAgZWxzZVxuICAgICAgaWYgXy5pc05hTihwYXJzZUludCh2YWx1ZSkpXG4gICAgICAgIHRocm93IFwiZXJyb3Igd2l0aCAje25hbWV9W1xcXCIje2tleX1cXFwiXSAtLSBleHBlY3RlZCBOdW1iZXIgLSBmb3VuZCAje2tleX1cIlxuXG4gIGlmIG9wdGlvbnMucmV2aXNpb24/XG4gICAgbmFtZSA9IFwiI3tuYW1lfS0je29wdGlvbnMucmV2aXNpb259XCJcblxuICByZXR1cm4gW25hbWUsIG9wdGlvbnNdXG5cbiMgZGVyaXZlIHNlY3JldHMgZm9yIEBhcmc6dmF1bHRfcmVxdWVzdCB1c2luZyBzdXBwbGllZCBAYXJnOnNlY3JldFxuIyBAcmV0dXJuIG9iamVjdCBtYXBwaW5nIHNlcnZpY2VfbmFtZShzKSB0byBkZXJpdmVkIHBhc3N3b3JkKHMpXG5jb21waWxlVmF1bHQgPSAoc2VjcmV0LCB2YXVsdF9yZXF1ZXN0KSAtPlxuXG4gIF9jaGVja1ZhdWx0KHZhdWx0X3JlcXVlc3QpXG5cbiAgdmF1bHRfdHJhbnNmb3JtZWQgPSB7fVxuXG4gIGZvciBzZXJ2aWNlX25hbWUsIHNlcnZpY2Vfc2V0dGluZ3Mgb2YgdmF1bHRfcmVxdWVzdFxuICAgIFtzZXJ2aWNlX3JldmlzaW9uX25hbWUsIHNlcnZpY2Vfc2V0dGluZ3NdID0gX2NoZWNrVmF1bHRPcHRpb25zKHNlcnZpY2VfbmFtZSwgc2VydmljZV9zZXR0aW5ncylcbiAgICBzZXR0aW5ncyA9IF8uZXh0ZW5kKHt9LCBzZXJ2aWNlX3NldHRpbmdzLCB7cGhyYXNlOnNlY3JldCwgc3ltYm9sOjB9KVxuICAgIHZhdWx0ID0gbmV3IFZhdWx0KHNldHRpbmdzKVxuICAgIHBhc3N3b3JkID0gdmF1bHQuZ2VuZXJhdGUoc2VydmljZV9yZXZpc2lvbl9uYW1lKVxuICAgIHZhdWx0X3RyYW5zZm9ybWVkW3NlcnZpY2VfbmFtZV0gPSBwYXNzd29yZFxuXG4gIHJldHVybiB2YXVsdF90cmFuc2Zvcm1lZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVWYXVsdCJdfQ==
