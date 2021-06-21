/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('disable analytics / user opt-out', function () {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .logAllCalls(true)
      .enterTestMode();
  }));

  afterEach(inject(function (Analytics) {
    Analytics.log.length = 0; // clear log
  }));

  describe('with universal analytics', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
    }));

    it('should be enabled by default', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.disableAnalytics).toBe(false);
      });
    });

    describe('when disabled', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.disableAnalytics(true);
      }));

      it('should be disabled', function () {
        inject(function (Analytics) {
          expect(Analytics.configuration.disableAnalytics).toBe(true);
        });
      });

      it('should log an info message about the account being disabled', function () {
        inject(function (Analytics, $window) {
          expect(Analytics.log[0]).toEqual([ 'info', 'Analytics disabled: UA-XXXXXX-xx' ]);
          expect($window['ga-disable-UA-XXXXXX-xx']).toBe(true);
        });
      });
    });
  });

  describe('with classic analytics', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(false);
    }));

    it('should be enabled by default', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.disableAnalytics).toBe(false);
      });
    });

    describe('when disabled', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.disableAnalytics(true);
      }));

      it('should be disabled', function () {
        inject(function (Analytics) {
          expect(Analytics.configuration.disableAnalytics).toBe(true);
        });
      });

      it('should log an info message about the account being disabled', function () {
        inject(function (Analytics, $window) {
          expect(Analytics.log[0]).toEqual([ 'info', 'Analytics disabled: UA-XXXXXX-xx' ]);
          expect($window['ga-disable-UA-XXXXXX-xx']).toBe(true);
        });
      });
    });
  });
});
