var ini = require('ini');

var types = {
  json: readJson,
  yaml: readYaml,
  ini: readIni,
  env: readIni,
  default: readFile // default for unsupported format or no extension file
};

var extensionPattern = /\.([^\.]+)$/i;

function readFile(grunt, file) {
  return grunt.file.read(file);
}

function readJson(grunt, file) {
  try {
    return grunt.file.readJSON(file);
  } catch (e) {
    return;
  }
}

function readYaml(grunt, file) {
  try {
    return grunt.file.readYAML(file);
  } catch (e) {
    return;
  }
}

function readIni(grunt, file) {
  try {
    return ini.parse(grunt.file.read(file));
  } catch (e) {
    return;
  }
}

module.exports = {
  // Export a single parse function that call the proper parsing function
  // Grunt is used here as it as already some parsing functions
  parse: function(grunt, file) {
    var match = file.match(extensionPattern);
    var type = match ? match[1] : 'default'; // default to ini format

    try {
      var parseFn = types[type] || types.default;
      return parseFn(grunt, file) || {};
    } catch (e) {
      return;
    }
  }
};
