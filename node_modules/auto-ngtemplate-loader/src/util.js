const { urlToRequest } = require('loader-utils');

function replaceTemplateUrl(variableName, lines, resolver) {
  const regEx = /(^\s*templateUrl\s*:\s*)['"](.*)['"](,*)(\s*)$/;
  const lineNumbers = lines.reduce(
    (result, line, i) => (/templateUrl/.test(line) ? result.concat(i) : result),
    []
  );
  const resolverFunc = resolver || urlToRequest;

  if (!lineNumbers.length) {
    return lines;
  }

  const templateRequires = lineNumbers
    .map((lineNumber, i) => {
      const [, , templateUrl] = regEx.exec(lines[lineNumber]) || [];
      const lineVariable = `${variableName}${i + 1}`;

      if (!templateUrl) {
        return null;
      }

      if (resolver && typeof resolver(templateUrl) !== 'string') {
        throw new Error(
          `Expected path resolver to return string for ${templateUrl}`
        );
      }

      const lineReplacement = lines[lineNumber].replace(
        regEx,
        `$1${lineVariable}$3`
      );

      return {
        lineVariable,
        templateUrl,
        lineNumber,
        lineReplacement
      };
    })
    .filter(i => i !== null);

  if (templateRequires.length === 0) {
    return lines;
  }

  const updatedLines = lines;

  templateRequires.forEach(x => {
    updatedLines[x.lineNumber] = x.lineReplacement;
  });

  return [
    ...templateRequires.map(
      x =>
        `const ${x.lineVariable} = require('${resolverFunc(x.templateUrl)}');`
    ),
    ``,
    ...updatedLines
  ];
}

module.exports = {
  replaceTemplateUrl
};
