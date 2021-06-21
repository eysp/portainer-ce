[![npm version](https://badge.fury.io/js/auto-ngtemplate-loader.svg)](https://badge.fury.io/js/auto-ngtemplate-loader)
[![Build Status](https://travis-ci.org/YashdalfTheGray/auto-ngtemplate-loader.svg?branch=master)](https://travis-ci.org/YashdalfTheGray/auto-ngtemplate-loader)

# auto-ngtemplate-loader

Auto require AngularJS 1.x templates in Webpack style

## Usage

Install the package by running `npm install auto-ngtemplate-loader`. Once installed, you can add it to your Webpack config.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'other-loaders', 'auto-ngtemplate-loader']
      }
    ]
  }
};
```

**Note** - It is recommended that this loader be run before any transpilation happens so it can operate on unchanged source code.

The next step is to add `ngtemplate-loader` and a loader that you want to handle your template code with. The most common one is `html-loader`. This will run every time Webpack encounters `require('something.html')`.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ngtemplate-loader',
            options: {
              relativeTo: 'src/'
            }
          },
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  }
};
```

It is a good idea to add the `relativeTo` option for `ngtemplate-loader` so that the templates aren't put into the Angular template cache with absolute paths which contain platform specific or user specific information. This will affect the portability of the bundled code.

### Options

This module supports configuration through either the `options` object method or the query string method. The valid options are listed in the table below.

| Name           | Type                       | Default Value                                                          | Details                                                                                                                                                                                                          |
| -------------- | -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variableName` | `string`                   | `autoNgTemplateLoaderTemplate`                                         | The variable name that gets injected into the compiled code. This is included so that variable collisions can be prevented.                                                                                      |
| `pathResolver` | `(path: string) => string` | [`urlToRequest`](https://github.com/webpack/loader-utils#urltorequest) | This function can be used to customize the require path in cases where templates don't use relative paths. This function is called with the path of the template and must return a string which is a valid path. |

### Webpack v1 Compatible Options

Since Webpack v1 only supports query strings for loaders and doesn't allow passing a function as an option, this loader has a `useResolverFromConfig` boolean option that can be passed in through the query string. The loader will look for the resolver in the Webpack configuration object under the key `autoNgTemplateLoader`. The only acceptable member of `autoNgTemplateLoader` is `pathResolver` which should be a function that returns a string for all cases. An example is below.

```javascript
module.exports = {
  autoNgTemplateLoader: {
    pathResolver: p => p.replace(/src/, '..').substring(1)
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader:
          'babel-loader!auto-ngtemplate-loader?variableName=testVar&useResolverFromConfig=true'
      }
    ]
  }
};
```

**Note**: The loader will throw an error if `useResolverFromConfig` is used in Webpack v2 or newer. The recommended way to pass the function is through the options in that case. This is because the Loader API v2 has deprecated a property that is used for the v1 workaround. The loader will check the version and report an error.

## Development

Please follow the guidelines in the [contribution guide](.github/CONTRIBUTING.md) for development.

### Installation

Once the repository is cloned, run `npm install` to get all the dependencies. The examples in this package also depend on `ngtemplate-loader` and `html-loader`. Those are declared as peer dependencies of this package so they need to be installed with `npm install ngtemplate-loader html-loader`.

If you're using a npm v5, you will need to include the `--no-save` flag so that they don't get added to the package dependencies.

### Running

There are two example projects includes. One that has one directive and another that has more. You can run `npm run one-directive`, `npm run many-directives` or `npm run multiple-directives` to see the loader in action. Once successful, examining the `build/bundle.js` file will show the results.

### Testing

The tests for this package are written in with ava. They can be run by running `npm test`.

### Linting

This project uses ESLint. All the requisite files can be linted using `npm run linter`. The rules for this project are located in `eslintrc.json`. This will also report prettier errors.

### Miscellaneous

This project also includes an `.nvmrc`. This is to tell [`nvm`](https://github.com/creationix/nvm) what version of Node.js to use for this project. It is set to v10.15.2 which is the current LTS release. However, any Node.js version greater than v10.15.2 should also work.

The project is also compatible with [`yarn`](https://yarnpkg.com/), Facebook's package manager. Normal `yarn` commands apply.

## Resources

- [How to write a Webpack loader](https://webpack.js.org/development/how-to-write-a-loader/)
- [Webpack Loader API](https://webpack.js.org/api/loaders/)
- [How to write a Webpack plugin](https://webpack.js.org/development/how-to-write-a-plugin/)
- [Webpack Plugin API](https://webpack.js.org/api/plugins/)
- [Webpack `loader-utils`](https://github.com/webpack/loader-utils)

Issue and PR templates derived from [smhxx/atom-ts-transpiler](https://github.com/smhxx/atom-ts-transpiler).
