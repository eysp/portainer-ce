import webpack from "webpack";
import WebpackBuildNotifierPlugin from '../index';
var os = require('os');

describe('WebpackBuildNotifierPlugin export initialization test', () => {
    it('WebpackBuildNotifierPlugin should not undefined', () => {
        expect(WebpackBuildNotifierPlugin).not.toBe(undefined);
    });

    it('WebpackBuildNotifierPlugin should not null', () => {
        expect(WebpackBuildNotifierPlugin).not.toBe(null);
    });
    
    it('WebpackBuildNotifierPlugin should be function', () => {
        expect(typeof WebpackBuildNotifierPlugin).toBe("function");
    });
});

describe('WebpackBuildNotifierPlugin instance test', () => {
    it('Should create a instance with title', () => {
        const instanceWithTitle = new WebpackBuildNotifierPlugin({
            title: "My Project Webpack Build",
        });

        expect(typeof instanceWithTitle).toBe("object");
    });

    it('Check default values', () => {
        const instanceWithTitle = new WebpackBuildNotifierPlugin({
        });
        expect(typeof instanceWithTitle).toBe("object");
        expect(instanceWithTitle.title).toBe("Webpack Build");
        expect(instanceWithTitle.icon).toBe(undefined);
        expect(instanceWithTitle.sound).toBe("Submarine");
        expect(instanceWithTitle.successSound).toBe("Submarine");
        expect(instanceWithTitle.failureSound).toBe("Submarine");
        expect(instanceWithTitle.compilationSound).toBe("Submarine");
        expect(instanceWithTitle.suppressSuccess).toBe(false);
        expect(instanceWithTitle.suppressWarning).toBe(false);
        expect(instanceWithTitle.suppressCompileStart).toBe(true);
        expect(instanceWithTitle.activateTerminalOnError).toBe(false);
    });

    it('Message formatter test short message', () => {
        const instance = new WebpackBuildNotifierPlugin({
            title: 'Example Configuration'
        });
        const message = { message: "Some short message"};
        expect(instance.messageFormatter(message, '')).toBe('' + os.EOL + "Some short message");
    });

    it('Message formatter test long message', () => {
        const instance = new WebpackBuildNotifierPlugin({
            title: 'Example Configuration'
        });
        const message = { message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."};
        expect(instance.messageFormatter(message, '')).toBe('' + os.EOL + "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has su");
    });

    it('onCompilationWatchRun should not exit with error', () => {
        const instance = new WebpackBuildNotifierPlugin({
            title: 'Example Configuration'
        });
        expect(instance.onCompilationWatchRun("", () => {})).toBe(undefined);
    });
});

describe("Test Webpack build", () => {
    it('Webpack should not throw any errors', (done) => {
        const options = require('./webpack.test1.success.config');
        webpack(options, function(err, stats) {
            expect(err).toBeNull();
            expect(stats.hasErrors()).toBeFalsy();
            done();
        });
    });
})