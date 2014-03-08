mimosa-vault
===========
## Overview

Mimosa module which uses the [vault](https://github.com/jcoglan/vault/tree/master/node) project to generate passwords
derived from a secret key.  The intent of the tool is to provide an easy way to generate passwords for various services
without embedding the secrets in the project's source.  Its a convenient way to re-derive all the
secrets the application needs without also requiring the syncing of an encrypted database.

This model also supports a workflow where each developer/deployment uses its own secret key - with each site deriving
their own unique versions of all the passwords that are used within the project.

Passwords are derived from a secret key and the derivation process can be controlled to specify the
character set of the derived passwords.  There is no encrypted database to keep in sync -- if you want to re-derive the
same passwords in multiple places, sync only the secret key.  The project source directly defines the various api's for
which secrets are needed -- when the application's needs change, you don't have to sync an encrypted database to
deploy the updated code -- you've already deployed the key ... just update the source code and rebuild at each site.

The module makes passwords available to mimosa -- allowing mimosa modules which deal with deployment to gain access to
credentials without requiring embedding the credentials in source code or mimosa-config.  Additionally, the module
will transform project files with the magic extension '.vault.coffee' (or .js or any extension which compiles to .js)
into compiled js which includes the secrets.  This is primarily useful for server-side code which needs embedded
passwords for something like database servers -- but is useful for managing client-side credentials that are needed
in development (eg passwords for testing accounts which may need to be made available when running project test suites).

When this module is included, mimosa-vault will use a project specific 'secret key' to transform any .vault.js or
.vault.coffee files within the project's source javascript directory into a json file containing passwords derived from
the key and conforming to any specified character class (in order to meet password character set/complexity requirements).

The vault module ensures that knowing any set of generated passwords does not allow deriving any other passwords
which would be derived from the secret key.

## Usage

Add `'vault'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

By default a key will be generated at .mimosa/vault/{project-name}.key if one does not already exist.  Overwrite
the key at any time.  Copy the key from another host or location to allow mimosa-vault to re-generate the same
secrets elsewhere or use a unique everywhere the code is deployed to get unique passwords for each code deployment.

## Quick Start

1. install mimosa-vault into project directory (project not currently available from npm)
2. add 'vault' to your module list
3. run a mimosa build once -- you've now generated a secret and a set of passwords from that secret
4. Set the passwords of any external services to use those derived by mimosa-vault with the above key.

Share the key with anyone with whom you want to share the project's credentials, keep the key secret from anyone with
whom you do not want to share the project's credentials.

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
{
 "my_twitter_account":"DUITB66R0ATQOUVZ9W7F",
 "my_development_couchdb_account":"qdJdsasYMSn dHN4QcNr"
}
```

Thesecret shown above for 'my_twitter_account" is actually a unique cryptographic hash mapping
(secret, "my_twitter_account", {"upper:1, "lower:0}) -> "derived secret" -- "derived secret" conforms to a character
alphabet which contains at least one upper and no lower case characters.

```
module.exports = {
    "some_service_login": {upper: 1, dash:0}
}

{upper:1, dash:0} is passed to the underlying Vault call -- each key represents a character set and value of each key
should be a Number 0 or greater.  0 means no characters from that character set should appear in the password.  A
number greater than 1 specifies that at least that many characters from that character set should appear in the
password.

See the vault project for a description of the options which can be used to control the derived password's alphabet
https://github.com/jcoglan/vault

## Default Config

```
    vault:
      extensionRegex: /.vault.[a-zA-Z]+$/    # regex indicating file extensions this module should process

      secret: null                  # path to secret which should be used to derive the project's passwords
                                    # this file should be kept SECRET and protected from anyone with whom you do
                                    # not wish to share credentials.
                                    # It should refer to a file at a path outside of the project source control --
                                    # if left at the default value, mimosa will use the path
                                    # .mimosa/vault/{app}.key within the project directory where {app} is the name of
                                    # the project as given in the package.json file
                                    # If this file does not exist, a new one will be generated when mimosa is run

      outputExtension: ".json"      # write json file by default

      mimosaSecrets: {}             # secrets which should be derived for the build process and made
                                    # available for other mimosa-modules as mimosaConfig.vault.mimosaSecrets
                                    # this allows secret derived from the key to be passed to other mimosa modules
```