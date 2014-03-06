Building a Module
===

As this is a CoffeeScript skeleton, it comes with its own `mimosa-config.coffee` that you can use to compile the skeleton itself.  (Installing CoffeeScript modules to NPM is frowned upon.)  Compilation of the skeleton will happen naturally when you run `mimosa mod:install`.  `mimosa mod:install` is how you would install this module locally to test it.

The contents of this skeleton consist of some example code, a ton of comments and some [Docco](http://jashkenas.github.io/docco/) style documentation.

If you have any questions about building a mimosa module, feel free to hit up @mimosajs or open up [an issue](https://github.com/dbashford/mimosa/issues?state=open) for discussion purposes.

The rest of this README is what you may want to transform the README to once development is complete.

mimosa-vault
===========
## Overview

Mimosa module which wraps the nodejs vault project to generate protected api keys and secrets for a project.

The intent is to easily allow the project to define the set of endpoints for which a secret is needed, while keeping
all secrets out of the project source code.

During project build, mimosa-vault will use a project specific ssh key (saved outside the project dir) to transform
any .vault.js or .vault.coffee files within the project's source javascript directory into a json file which maps the
username to the secret which the application should use to authenticate to that service.

## Usage

Create an ssh key to protect this project:
    `mimosa vault:new-key`

Add `'vault'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

Use the command `mimosa vault--help`

## Functionality

Describe the api's which need secrets where needed as simple json objects within your javascriptDir:
    eg

assets/javascripts/some_secrets.vault.coffee
```
module.exports =
    "my_twitter_account": null
    "my_development_couchdb_account": null
```

mimosa-vault will compile this to:

public/javascripts/some_secrets.vault.js
```
module.exports = {
    "my_twitter_account": "asdlfkj3284u19834oijfo283u4oiqj234lk23423l"
    "my_development_couchdb_account": "alskj3o824u01234alwko42u34l12j41,23;sp"
}
```

Where the secret shown above is actually a unique cryptographic hash mapping (ssh_key, "twitter-my_twitter_account") -> "secret"

If needed you can control the alphabet into which the secret is mapped by passing options to the underlying vault call used to
generate your password.

```
module.exports = {
    "some_service_login": "--upper 1 --symbol 0"
}

See the vault project for a description of the options which can be used to control the password alphabet
https://github.com/jcoglan/vault


## Default Config

```
  extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process

  sshKey: null                  # path to ssh key which should be used to derive the secrets
                                # -- should refer to a path outside of the project dir --
                                # if null, mimosa will use the path
                                # ~/.mimosa/vault/{app}.key where {app} is the name of the
                                # project as given in the package.json file
```