"use strict";

class CleanTerminalPlugin {
  constructor(options = {}) {
    this.message = options.message;
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.afterCompile.tap("CleanTerminalPlugin", () => {
        if (process.env.NODE_ENV !== "production") this.clearConsole();
      });
    } else {
      // backwards compatible version of compiler.hooks
      compiler.plugin("emit", (_, done) => {
        if (process.env.NODE_ENV !== "production") this.clearConsole();
        done();
      });
    }
  }

  clearConsole() {
    const clear = "\x1B[2J\x1B[3J\x1B[H";
    const output = this.message ? clear + this.message + "\n\n" : clear;
    process.stdout.write(output);
  }
}

module.exports = CleanTerminalPlugin;
