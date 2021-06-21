var path = require("path");

module.exports = function(grunt){
    grunt.registerMultiTask("eslint", "Validate files with ESLint", function(){
        var CLIEngine = require("eslint").CLIEngine;
        var eslint;
        var response;
        var formatter;
        var report;
        var options = this.options({
            "silent": false,
            "quiet": false,
            "maxWarnings": -1,
            "format": "stylish",
            "callback": "false",
            "terminateOnCallback": "true"
        });

        if(this.filesSrc.length === 0){
            return console.log("No Files specified");
        }

        try{
            eslint = new CLIEngine(options);
            response = eslint.executeOnFiles(this.filesSrc);
        }
        catch(err){
            grunt.warn(err);
            return;
        }

        if(options.callback && options.callback.constructor === Function){
            if(options.terminateOnCallback) {
                return options.callback(response);
            }
            response = options.callback(response) || response;
        }

        formatter = eslint.getFormatter(options.format);

        if (!formatter) {
            grunt.warn("Formatter " + options.format + " not found");
            return;
        }

        if (options.fix) {
            CLIEngine.outputFixes(response);
        }

        if (options.quiet) {
            response.results = CLIEngine.getErrorResults(response.results);
        }

        report = formatter(response.results);

        if (options.outputFile) {
            grunt.file.write(options.outputFile, report);
            grunt.log.writeln('Report written to ' + options.outputFile);
        } else {
            console.log(report);
        }

        if(options.silent){
            return true;
        }
        else if(options.maxWarnings > -1 && response.warningCount > options.maxWarnings){
            return false;
        }
        else{
            return response.errorCount === 0;
        }
    });
};
