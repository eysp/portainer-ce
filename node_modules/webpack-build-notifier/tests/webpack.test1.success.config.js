import WebpackBuildNotifierPlugin from "./../index";
const path = require("path");

const dir = p => path.resolve(__dirname, p);
module.exports = {
    entry: dir("sample.js"),
    output: {
        path: dir("assets"),
        publicPath: "/",
        filename: "success.bundle.js"
    },
    mode: "development",
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
        }
        ]
    },
    resolve: {
        extensions: [".js"]
    },
    plugins: [
        new WebpackBuildNotifierPlugin({
            title: "Build Notification",
            suppressCompileStart: false,
        })       
    ]
};

