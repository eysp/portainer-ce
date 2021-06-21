# Clean Terminal Webpack Plugin
Cleans your terminal output during development to only show the latest build
information.

# Install
Via npm:

```
npm i -D clean-terminal-webpack-plugin
```

# Usage
Via webpack config file:

```js
// webpack.config.js

const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
  plugins: [
    new CleanTerminalPlugin()
  ]
};
```

# API
The plugin accepts an `options` Object:

| key | type | required | description |
| --- | --- | --- | --- |
| message | String | false | Message to be printend. |

## Example
```js
// webpack.config.js

const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

const HOST = 'localhost';
const PORT = 8888;

module.exports = {
  plugins: [
    new CleanTerminalPlugin({
      message: `dev server running on http://${HOST}:${PORT}`
    })
  ]
};
```