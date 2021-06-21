/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('universal analytics debug mode', function () {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .useAnalytics(true)
      .logAllCalls(true)
      .enterTestMode();
  }));

  afterEach(inject(function (Analytics) {
    Analytics.log.length = 0; // clear log
  }));

  it('should have debug mode disabled by default', function () {
    inject(function (Analytics) {
      expect(Analytics.configuration.debugMode).toBe(false);
    });
  });

  it('should have trace debugging mode disabled by default', function () {
    inject(function (Analytics) {
      expect(Analytics.configuration.traceDebuggingMode).toBe(false);
    });
  });

  describe('without trace debugging mode', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.enterDebugMode();
    }));

    it('should have debug mode enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.debugMode).toBe(true);
      });
    });

    it('should have trace debugging disabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.traceDebuggingMode).toBe(false);
      });
    });

    it('should inject the analytics debug script', function () {
      inject(function (Analytics) {
        expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics_debug.js']);
      });
    });

    it('should not set the analytics trace debugging variable', function () {
      inject(function (Analytics, $window) {
        expect($window.ga_debug).toEqual(undefined);
      });
    });
  });

  describe('with trace debugging mode', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.enterDebugMode(true);
    }));

    it('should have debug mode enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.debugMode).toBe(true);
      });
    });

    it('should have trace debugging enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.traceDebuggingMode).toBe(true);
      });
    });

    it('should inject the analytics debug script', function () {
      inject(function (Analytics) {
        expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics_debug.js']);
      });
    });

    it('should set the analytics trace debugging variable', function () {
      inject(function (Analytics, $window) {
        expect($window.ga_debug).toEqual({ trace: true });
      });
    });
  });
});
