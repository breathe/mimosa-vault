exports.config =
  minMimosaVersion: "2.1.10"
  modules: [ 'coffeescript', 'jshint']
  watch:
    sourceDir: "src"
    compiledDir: "lib"
    javascriptDir: null
  jshint:
    rules:
      node: true