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
    _ref = _.union(Vault.TYPES, ['length', 'repeat']);
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
  return options;
};

compileVault = function(secret, vault_request) {
  var password, service_name, service_settings, settings, vault, vault_transformed;
  _checkVault(vault_request);
  vault_transformed = {};
  for (service_name in vault_request) {
    service_settings = vault_request[service_name];
    service_settings = _checkVaultOptions(service_name, service_settings);
    settings = _.extend({}, service_settings, {
      phrase: secret,
      symbol: 0
    });
    vault = new Vault(settings);
    password = vault.generate(service_name);
    vault_transformed[service_name] = password;
  }
  return vault_transformed;
};

module.exports = compileVault;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9wbHVnaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQUEsdURBQUE7RUFBQSxxSkFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FBSixDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsV0FJQSxHQUFjLFNBQUMsR0FBRCxHQUFBO0FBQ1osTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0saUJBQU4sQ0FBQTtBQUNBLEVBQUEsSUFBRyxDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsQ0FBSDtBQUNFLFVBQU0sRUFBQSxHQUFFLEdBQUYsR0FBTyxpQ0FBYixDQURGO0dBREE7QUFHQSxFQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiLENBQUg7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sb0NBQWIsQ0FERjtHQUhBO0FBS0EsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxHQUFYLENBQVA7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sNEJBQVAsR0FBa0MsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUF4QyxDQURGO0dBTlk7QUFBQSxDQUpkLENBQUE7O0FBQUEsa0JBY0EsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBSW5CLE1BQUEsOEJBQUE7QUFBQSxFQUFBLGVBQUE7O0FBQW1CO0FBQUE7U0FBQSwyQ0FBQTttQkFBQTtBQUFBLG9CQUFBLENBQUMsQ0FBQyxXQUFGLENBQUEsRUFBQSxDQUFBO0FBQUE7O01BQW5CLENBQUE7QUFBQSxFQUVBLFlBQUEsVUFBWSxHQUZaLENBQUE7QUFHQSxFQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsUUFBRixDQUFXLE9BQVgsQ0FBSixJQUEyQixDQUFDLENBQUMsT0FBRixDQUFVLE9BQVYsQ0FBM0IsSUFBaUQsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxPQUFiLENBQXBEO0FBQ0UsVUFBTywyQkFBQSxHQUEwQixJQUExQixHQUFnQyxzQ0FBaEMsR0FBcUUsZUFBNUUsQ0FERjtHQUhBO0FBTUEsT0FBQSxjQUFBO3lCQUFBO0FBQ0UsSUFBQSxJQUFHLGVBQVcsZUFBWCxFQUFBLEdBQUEsS0FBSDtBQUNFLFlBQU8sYUFBQSxHQUFZLElBQVosR0FBa0IscUJBQWxCLEdBQXNDLEdBQXRDLEdBQTJDLFdBQWxELENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsUUFBQSxDQUFTLEtBQVQsQ0FBUixDQUFIO0FBQ0UsY0FBTyxhQUFBLEdBQVksSUFBWixHQUFrQixLQUFsQixHQUFzQixHQUF0QixHQUEyQixpQ0FBM0IsR0FBMkQsR0FBbEUsQ0FERjtPQUhGO0tBREY7QUFBQSxHQU5BO0FBYUEsU0FBTyxPQUFQLENBakJtQjtBQUFBLENBZHJCLENBQUE7O0FBQUEsWUFtQ0EsR0FBZSxTQUFDLE1BQUQsRUFBUyxhQUFULEdBQUE7QUFFYixNQUFBLDRFQUFBO0FBQUEsRUFBQSxXQUFBLENBQVksYUFBWixDQUFBLENBQUE7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLEVBRnBCLENBQUE7QUFJQSxPQUFBLDZCQUFBO21EQUFBO0FBQ0UsSUFBQSxnQkFBQSxHQUFtQixrQkFBQSxDQUFtQixZQUFuQixFQUFpQyxnQkFBakMsQ0FBbkIsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQUFhLGdCQUFiLEVBQStCO0FBQUEsTUFBQyxNQUFBLEVBQU8sTUFBUjtBQUFBLE1BQWdCLE1BQUEsRUFBTyxDQUF2QjtLQUEvQixDQURYLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxRQUFOLENBRlosQ0FBQTtBQUFBLElBR0EsUUFBQSxHQUFXLEtBQUssQ0FBQyxRQUFOLENBQWUsWUFBZixDQUhYLENBQUE7QUFBQSxJQUlBLGlCQUFrQixDQUFBLFlBQUEsQ0FBbEIsR0FBa0MsUUFKbEMsQ0FERjtBQUFBLEdBSkE7QUFXQSxTQUFPLGlCQUFQLENBYmE7QUFBQSxDQW5DZixDQUFBOztBQUFBLE1Ba0RNLENBQUMsT0FBUCxHQUFpQixZQWxEakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuVmF1bHQgPSByZXF1aXJlKCd2YXVsdCcpXG5cbiMgbm9pc2lseSBlbmZvcmNlIHRoZSBzaGFwZSBvZiB2YXVsdF9yZXF1ZXN0IG9iamVjdFxuX2NoZWNrVmF1bHQgPSAob2JqKSAtPlxuICBlcnIgPSBcIm1vZHVsZS5leHBvcnRzOlwiXG4gIGlmIF8uaXNBcnJheShvYmopXG4gICAgdGhyb3cgXCIje2Vycn0gZXhwZWN0ZWQgb2JqZWN0IC0tIGZvdW5kIGFycmF5XCJcbiAgaWYgXy5pc0Z1bmN0aW9uKG9iailcbiAgICB0aHJvdyBcIiN7ZXJyfSBleHBlY3RlZCBvYmplY3QgLS0gZm91bmQgZnVuY3Rpb25cIlxuICBpZiBub3QgXy5pc09iamVjdChvYmopXG4gICAgdGhyb3cgXCIje2Vycn0gZXhwZWN0ZWQgb2JqZWN0IC0tIGZvdW5kICN7dHlwZW9mKG9iail9XCJcblxuIyBub2lzaWx5IHZlcmlmeSB0aGUgc2hhcGUgb2YgdGhlIG9wdGlvbnMgaW4gZWFjaCB2YXVsdF9yZXF1ZXN0XG5fY2hlY2tWYXVsdE9wdGlvbnMgPSAobmFtZSwgb3B0aW9ucykgLT5cblxuICAjIHBhc3NpbmcgJ3N5bWJvbCc+MSB0byBWYXVsdCBjb25zdHJ1Y3RvciB3b3VsZCBicmVhayB0aGUganNvbiBlbmNvZGluZyBvZiB0aGUgb3V0cHV0IC4uLlxuICAjIGRvbid0IGFsbG93IHVzZXIgdG8gdHVybiBvbiB0aGUgc3ltYm9sIG9wdGlvbiBhbmQgY29tcGxhaW4gaWYgdGhleSBkb1xuICBBTExPV0VEX09QVElPTlMgPSAoaS50b0xvd2VyQ2FzZSgpIGZvciBpIGluIF8udW5pb24oVmF1bHQuVFlQRVMsIFsnbGVuZ3RoJywgJ3JlcGVhdCddKSlcblxuICBvcHRpb25zIG9yPSB7fVxuICBpZiBub3QgXy5pc09iamVjdChvcHRpb25zKSBvciBfLmlzQXJyYXkob3B0aW9ucykgb3IgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG4gICAgdGhyb3cgXCJlcnJvciB3aXRoIHZhbHVlIG9mIGtleTogI3tuYW1lfSAtLSBzaG91bGQgYmUgb2JqZWN0IHdpdGgga2V5cyBmcm9tICN7QUxMT1dFRF9PUFRJT05TfVwiXG5cbiAgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9uc1xuICAgIGlmIGtleSBub3QgaW4gQUxMT1dFRF9PUFRJT05TXG4gICAgICB0aHJvdyBcImVycm9yIHdpdGggI3tuYW1lfSAtLSBpbnZhbGlkIG9wdGlvbiAje2tleX0gc3VwcGxpZWRcIlxuICAgIGVsc2VcbiAgICAgIGlmIF8uaXNOYU4ocGFyc2VJbnQodmFsdWUpKVxuICAgICAgICB0aHJvdyBcImVycm9yIHdpdGggI3tuYW1lfVtcXFwiI3trZXl9XFxcIl0gLS0gZXhwZWN0ZWQgTnVtYmVyIC0gZm91bmQgI3trZXl9XCJcblxuICByZXR1cm4gb3B0aW9uc1xuXG4jIGRlcml2ZSBzZWNyZXRzIGZvciBAYXJnOnZhdWx0X3JlcXVlc3QgdXNpbmcgc3VwcGxpZWQgQGFyZzpzZWNyZXRcbiMgQHJldHVybiBvYmplY3QgbWFwcGluZyBzZXJ2aWNlX25hbWUocykgdG8gZGVyaXZlZCBwYXNzd29yZChzKVxuY29tcGlsZVZhdWx0ID0gKHNlY3JldCwgdmF1bHRfcmVxdWVzdCkgLT5cblxuICBfY2hlY2tWYXVsdCh2YXVsdF9yZXF1ZXN0KVxuXG4gIHZhdWx0X3RyYW5zZm9ybWVkID0ge31cblxuICBmb3Igc2VydmljZV9uYW1lLCBzZXJ2aWNlX3NldHRpbmdzIG9mIHZhdWx0X3JlcXVlc3RcbiAgICBzZXJ2aWNlX3NldHRpbmdzID0gX2NoZWNrVmF1bHRPcHRpb25zKHNlcnZpY2VfbmFtZSwgc2VydmljZV9zZXR0aW5ncylcbiAgICBzZXR0aW5ncyA9IF8uZXh0ZW5kKHt9LCBzZXJ2aWNlX3NldHRpbmdzLCB7cGhyYXNlOnNlY3JldCwgc3ltYm9sOjB9KVxuICAgIHZhdWx0ID0gbmV3IFZhdWx0KHNldHRpbmdzKVxuICAgIHBhc3N3b3JkID0gdmF1bHQuZ2VuZXJhdGUoc2VydmljZV9uYW1lKVxuICAgIHZhdWx0X3RyYW5zZm9ybWVkW3NlcnZpY2VfbmFtZV0gPSBwYXNzd29yZFxuXG4gIHJldHVybiB2YXVsdF90cmFuc2Zvcm1lZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVWYXVsdCJdfQ==
