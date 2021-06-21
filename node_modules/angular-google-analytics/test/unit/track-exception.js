/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('universal analytics exception tracking', function () {
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

  it('should have a trackException method', function () {
    inject(function (Analytics) {
      expect(typeof Analytics.trackException === 'function').toBe(true);
    });
  });

  it('should allow for tracking an exception with no parameters provided', function () {
    inject(function (Analytics) {
      Analytics.log.length = 0; // clear log
      Analytics.trackException();
      expect(Analytics.log[0]).toEqual(['send', 'exception', { exDescription: undefined, exFatal: false }]);
    });
  });

  it('should allow for tracking an exception with all parameters provided', function () {
    inject(function (Analytics) {
      Analytics.log.length = 0; // clear log
      Analytics.trackException('Something fatal happened!', true);
      expect(Analytics.log[0]).toEqual(['send', 'exception', { exDescription: 'Something fatal happened!', exFatal: true }]);
    });
  });

  describe('supports tracking for multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: 'tracker1', trackEvent: true },
      { tracker: 'UA-12345-34', name: 'tracker2' },
      { tracker: 'UA-12345-45', trackEvent: true }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should track exceptions for all objects', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.trackException('Something fatal happened!', true);
          expect($window.ga).toHaveBeenCalledWith('tracker1.send', 'exception', { exDescription: 'Something fatal happened!', exFatal: true });
          expect($window.ga).toHaveBeenCalledWith('tracker2.send', 'exception', { exDescription: 'Something fatal happened!', exFatal: true });
          expect($window.ga).toHaveBeenCalledWith('send', 'exception', { exDescription: 'Something fatal happened!', exFatal: true });
        });
      });
    });
  });
});
