mimosa-vault
===========
## Overview

Mimosa module wrapping the node [vault](https://github.com/jcoglan/vault/tree/master/node) tool to generate passwords
that need to be used in a project -- without storing the passwords in the source.

Passwords derived via this project are uniquely determined by a secret key and the service api name - there is no
encrypted database to keep in sync -- just protect the secret and you've protected the passwords.

When this module is included, mimosa-vault will use a project specific 'secret key' to transform any .vault.js or
.vault.coffee files within the project's source javascript directory into a json file containing the passwords that
should be used for that service.

Input files can specify character classes which should or should/not be included in the generated password (to allow
passwords to match particular types of complexity controls).

## Usage

Add `'vault'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

By default a key will be generated at .mimosa/vault/{project-name}.key if one does not already exist.  Overwrite
the key at any time.  Copy the key from another host or location to allow mimosa-vault to re-generate the same
secrets used elsewhere.

## Quick Start

1. install mimosa-vault into project directory (project not currently available from npm)
2. add 'vault' to your module list
3. run a mimosa build once -- you've now generated a secret and a set of passwords from that secret
4. Set the passwords of any external services to use those derived by mimosa-vault with the above key.

Share the key with anyone you want to share the project's credentials, keep the key secret from anyone with whom
you do not want to share the project's credentials.

## Functionality

Describe the api's which need secrets as simple objects within your javascriptDir.  For example:

assets/javascripts/some_secrets.vault.coffee
```
module.exports =
    "my_twitter_account": {"upper":1, "lower":0}
    "my_development_couchdb_account": {}
```

mimosa-vault will compile this to:

public/javascripts/some_secrets.json
```
{"my_twitter_account":"DUITB66R0ATQOUVZ9W7F","my_development_couchdb_account":"qdJdsasYMSn dHN4QcNr"}
```

Where the secret shown above is actually a unique cryptographic hash mapping
(secret, "twitter-my_twitter_account") -> "derived secret"

If needed you can control the alphabet into which the secret is mapped by passing options to the underlying vault call
used to generate your password:

```
module.exports = {
    "some_service_login": {upper: 1, dash:0}
}

See the vault project for a description of the options which can be used to control the password alphabet
https://github.com/jcoglan/vault

## Default Config

```
    vault:
      extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process

      secret: null                  # path to secret passphrase which should be used to derive the secrets
                                    # this file should be kept SECRET and protected from anyone with whom you do
                                    # not wish to share credentials.
                                    # It should refer to a file at a path outside of the project source control --
                                    # if left at the default value, mimosa will use the path
                                    # .mimosa/vault/{app}.key within the project directory where {app} is the name of
                                    # the project as given in the package.json file

      outputExtension: ".json"      # outputted is formatted as json -- write json file by default

      mimosaSecrets: {}             # secrets which should be derived for the build process and made
                                    # available for other mimosa-modules as config.vault.mimosaSecrets
                                    # this allows derived secrets to be passed to other mimosa modules
```