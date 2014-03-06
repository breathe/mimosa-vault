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
  ALLOWED_OPTIONS = _.without((function() {
    var _i, _len, _ref, _results;
    _ref = _.union(Vault.TYPES, ['length', 'repeat']);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.toLowerCase());
    }
    return _results;
  })(), "symbol");
  options || (options = {});
  if (!_.isObject(options) || _.isArray(options) || _.isFunction(options)) {
    throw "error in key: " + name + " -- value should be object with keys from " + ALLOWED_OPTIONS;
  }
  for (key in ALLOWED_OPTIONS) {
    value = ALLOWED_OPTIONS[key];
    if (__indexOf.call(options, key) >= 0) {
      if (_.isNaN(parseInt(value))) {
        throw "error in key " + key + " -- value should be a Number - found " + key;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25jb2hlbi9zb2Z0d2FyZS9kcnlpdC1wcm9qZWN0cy9taW1vc2EtdmF1bHQvbGliL3BsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi9Vc2Vycy9uY29oZW4vc29mdHdhcmUvZHJ5aXQtcHJvamVjdHMvbWltb3NhLXZhdWx0L3NyYy9wbHVnaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQUEsdURBQUE7RUFBQSxxSkFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FBSixDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsT0FBUixDQURSLENBQUE7O0FBQUEsV0FJQSxHQUFjLFNBQUMsR0FBRCxHQUFBO0FBQ1osTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0saUJBQU4sQ0FBQTtBQUNBLEVBQUEsSUFBRyxDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsQ0FBSDtBQUNFLFVBQU0sRUFBQSxHQUFFLEdBQUYsR0FBTyxpQ0FBYixDQURGO0dBREE7QUFHQSxFQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiLENBQUg7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sb0NBQWIsQ0FERjtHQUhBO0FBS0EsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxHQUFYLENBQVA7QUFDRSxVQUFNLEVBQUEsR0FBRSxHQUFGLEdBQU8sNEJBQVAsR0FBa0MsQ0FBQSxNQUFBLENBQUEsR0FBQSxDQUF4QyxDQURGO0dBTlk7QUFBQSxDQUpkLENBQUE7O0FBQUEsa0JBY0EsR0FBcUIsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBSW5CLE1BQUEsOEJBQUE7QUFBQSxFQUFBLGVBQUEsR0FBa0IsQ0FBQyxDQUFDLE9BQUY7O0FBQVU7QUFBQTtTQUFBLDJDQUFBO21CQUFBO0FBQUEsb0JBQUEsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxFQUFBLENBQUE7QUFBQTs7TUFBVixFQUErRSxRQUEvRSxDQUFsQixDQUFBO0FBQUEsRUFFQSxZQUFBLFVBQVksR0FGWixDQUFBO0FBR0EsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxPQUFYLENBQUosSUFBMkIsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxPQUFWLENBQTNCLElBQWlELENBQUMsQ0FBQyxVQUFGLENBQWEsT0FBYixDQUFwRDtBQUNFLFVBQU8sZ0JBQUEsR0FBZSxJQUFmLEdBQXFCLDRDQUFyQixHQUFnRSxlQUF2RSxDQURGO0dBSEE7QUFNQSxPQUFBLHNCQUFBO2lDQUFBO0FBQ0UsSUFBQSxJQUFHLGVBQU8sT0FBUCxFQUFBLEdBQUEsTUFBSDtBQUNFLE1BQUEsSUFBRyxDQUFDLENBQUMsS0FBRixDQUFRLFFBQUEsQ0FBUyxLQUFULENBQVIsQ0FBSDtBQUNFLGNBQU8sZUFBQSxHQUFjLEdBQWQsR0FBbUIsdUNBQW5CLEdBQXlELEdBQWhFLENBREY7T0FERjtLQURGO0FBQUEsR0FOQTtBQVdBLFNBQU8sT0FBUCxDQWZtQjtBQUFBLENBZHJCLENBQUE7O0FBQUEsWUFpQ0EsR0FBZSxTQUFDLE1BQUQsRUFBUyxhQUFULEdBQUE7QUFFYixNQUFBLDRFQUFBO0FBQUEsRUFBQSxXQUFBLENBQVksYUFBWixDQUFBLENBQUE7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLEVBRnBCLENBQUE7QUFJQSxPQUFBLDZCQUFBO21EQUFBO0FBQ0UsSUFBQSxnQkFBQSxHQUFtQixrQkFBQSxDQUFtQixZQUFuQixFQUFpQyxnQkFBakMsQ0FBbkIsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQUFhLGdCQUFiLEVBQStCO0FBQUEsTUFBQyxNQUFBLEVBQU8sTUFBUjtBQUFBLE1BQWdCLE1BQUEsRUFBTyxDQUF2QjtLQUEvQixDQURYLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxRQUFOLENBRlosQ0FBQTtBQUFBLElBR0EsUUFBQSxHQUFXLEtBQUssQ0FBQyxRQUFOLENBQWUsWUFBZixDQUhYLENBQUE7QUFBQSxJQUlBLGlCQUFrQixDQUFBLFlBQUEsQ0FBbEIsR0FBa0MsUUFKbEMsQ0FERjtBQUFBLEdBSkE7QUFXQSxTQUFPLGlCQUFQLENBYmE7QUFBQSxDQWpDZixDQUFBOztBQUFBLE1BZ0RNLENBQUMsT0FBUCxHQUFpQixZQWhEakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuVmF1bHQgPSByZXF1aXJlKCd2YXVsdCcpXG5cbiMgbm9pc2lseSBlbmZvcmNlIHRoZSBzaGFwZSBvZiB2YXVsdF9yZXF1ZXN0IG9iamVjdFxuX2NoZWNrVmF1bHQgPSAob2JqKSAtPlxuICBlcnIgPSBcIm1vZHVsZS5leHBvcnRzOlwiXG4gIGlmIF8uaXNBcnJheShvYmopXG4gICAgdGhyb3cgXCIje2Vycn0gZXhwZWN0ZWQgb2JqZWN0IC0tIGZvdW5kIGFycmF5XCJcbiAgaWYgXy5pc0Z1bmN0aW9uKG9iailcbiAgICB0aHJvdyBcIiN7ZXJyfSBleHBlY3RlZCBvYmplY3QgLS0gZm91bmQgZnVuY3Rpb25cIlxuICBpZiBub3QgXy5pc09iamVjdChvYmopXG4gICAgdGhyb3cgXCIje2Vycn0gZXhwZWN0ZWQgb2JqZWN0IC0tIGZvdW5kICN7dHlwZW9mKG9iail9XCJcblxuIyBub2lzaWx5IHZlcmlmeSB0aGUgc2hhcGUgb2YgdGhlIG9wdGlvbnMgaW4gZWFjaCB2YXVsdF9yZXF1ZXN0XG5fY2hlY2tWYXVsdE9wdGlvbnMgPSAobmFtZSwgb3B0aW9ucykgLT5cblxuICAjIHBhc3NpbmcgJ3N5bWJvbCc+MSB0byBWYXVsZSBjb25zdHJ1Y3RvciB3b3VsZCBicmVhayB0aGUganNvbiBlbmNvZGluZyBvZiB0aGUgb3V0cHV0IC4uLlxuICAjIGRvbid0IGFsbG93IHVzZXIgdG8gdHVybiBvbiB0aGUgc3ltYm9sIG9wdGlvbiBhbmQgY29tcGxhaW4gaWYgdGhleSBkb1xuICBBTExPV0VEX09QVElPTlMgPSBfLndpdGhvdXQoaS50b0xvd2VyQ2FzZSgpIGZvciBpIGluIF8udW5pb24oVmF1bHQuVFlQRVMsIFsnbGVuZ3RoJywgJ3JlcGVhdCddKSwgXCJzeW1ib2xcIilcblxuICBvcHRpb25zIG9yPSB7fVxuICBpZiBub3QgXy5pc09iamVjdChvcHRpb25zKSBvciBfLmlzQXJyYXkob3B0aW9ucykgb3IgXy5pc0Z1bmN0aW9uKG9wdGlvbnMpXG4gICAgdGhyb3cgXCJlcnJvciBpbiBrZXk6ICN7bmFtZX0gLS0gdmFsdWUgc2hvdWxkIGJlIG9iamVjdCB3aXRoIGtleXMgZnJvbSAje0FMTE9XRURfT1BUSU9OU31cIlxuXG4gIGZvciBrZXksIHZhbHVlIG9mIEFMTE9XRURfT1BUSU9OU1xuICAgIGlmIGtleSBpbiBvcHRpb25zXG4gICAgICBpZiBfLmlzTmFOKHBhcnNlSW50KHZhbHVlKSlcbiAgICAgICAgdGhyb3cgXCJlcnJvciBpbiBrZXkgI3trZXl9IC0tIHZhbHVlIHNob3VsZCBiZSBhIE51bWJlciAtIGZvdW5kICN7a2V5fVwiXG5cbiAgcmV0dXJuIG9wdGlvbnNcblxuIyBkZXJpdmUgc2VjcmV0cyBmb3IgQGFyZzp2YXVsdF9yZXF1ZXN0IHVzaW5nIHN1cHBsaWVkIEBhcmc6c2VjcmV0XG4jIEByZXR1cm4gb2JqZWN0IG1hcHBpbmcgc2VydmljZV9uYW1lKHMpIHRvIGRlcml2ZWQgcGFzc3dvcmQocylcbmNvbXBpbGVWYXVsdCA9IChzZWNyZXQsIHZhdWx0X3JlcXVlc3QpIC0+XG5cbiAgX2NoZWNrVmF1bHQodmF1bHRfcmVxdWVzdClcblxuICB2YXVsdF90cmFuc2Zvcm1lZCA9IHt9XG5cbiAgZm9yIHNlcnZpY2VfbmFtZSwgc2VydmljZV9zZXR0aW5ncyBvZiB2YXVsdF9yZXF1ZXN0XG4gICAgc2VydmljZV9zZXR0aW5ncyA9IF9jaGVja1ZhdWx0T3B0aW9ucyhzZXJ2aWNlX25hbWUsIHNlcnZpY2Vfc2V0dGluZ3MpXG4gICAgc2V0dGluZ3MgPSBfLmV4dGVuZCh7fSwgc2VydmljZV9zZXR0aW5ncywge3BocmFzZTpzZWNyZXQsIHN5bWJvbDowfSlcbiAgICB2YXVsdCA9IG5ldyBWYXVsdChzZXR0aW5ncylcbiAgICBwYXNzd29yZCA9IHZhdWx0LmdlbmVyYXRlKHNlcnZpY2VfbmFtZSlcbiAgICB2YXVsdF90cmFuc2Zvcm1lZFtzZXJ2aWNlX25hbWVdID0gcGFzc3dvcmRcblxuICByZXR1cm4gdmF1bHRfdHJhbnNmb3JtZWRcblxubW9kdWxlLmV4cG9ydHMgPSBjb21waWxlVmF1bHQiXX0=
