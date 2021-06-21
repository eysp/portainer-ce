"use strict";

/**
 * filesize
 *
 * @copyright 2017 Anthony Lapenna <anthony.lapenna@portainer.io>
 * @license MIT
 * @version 0.1.0
 */
(function (global) {
  function splitargs(input, sep, keepQuotes) {
      var separator = sep || /\s/g;
      var singleQuoteOpen = false;
      var doubleQuoteOpen = false;
      var tokenBuffer = [];
      var ret = [];

      var arr = input.split('');
      for (var i = 0; i < arr.length; ++i) {
          var element = arr[i];
          var matches = element.match(separator);
          if (element === "'" && !doubleQuoteOpen) {
              if (keepQuotes === true) {
                  tokenBuffer.push(element);
              }
              singleQuoteOpen = !singleQuoteOpen;
              continue;
          } else if (element === '"' && !singleQuoteOpen) {
              if (keepQuotes === true) {
                  tokenBuffer.push(element);
              }
              doubleQuoteOpen = !doubleQuoteOpen;
              continue;
          }

          if (!singleQuoteOpen && !doubleQuoteOpen && matches) {
              if (tokenBuffer.length > 0) {
                  ret.push(tokenBuffer.join(''));
                  tokenBuffer = [];
              } else if (!!sep) {
                  ret.push(element);
              }
          } else {
              tokenBuffer.push(element);
          }
      }
      if (tokenBuffer.length > 0) {
          ret.push(tokenBuffer.join(''));
      } else if (!!sep) {
          ret.push('');
      }
      return ret;
  }

	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = splitargs;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return splitargs;
		});
	} else {
		global.splitargs = splitargs;
	}
})(typeof window !== "undefined" ? window : global);
