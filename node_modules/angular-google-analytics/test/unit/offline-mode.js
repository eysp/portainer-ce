/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('offline mode', function () {
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

    describe('at startup', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.startOffline(true);
      }));

      it('should have offline set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.offline()).toBe(true);
        });
      });

      it('should have delay script tag set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.configuration.delayScriptTag).toBe(true);
        });
      });

      it('should not have sent any commands while offline', function () {
        inject(function (Analytics) {
          Analytics.trackPage('/page/here');
          expect(Analytics.log.length).toBe(0);
        });
      });

      it('should send everything when script is added and reset to online', function () {
        inject(function (Analytics, $window) {
          Analytics.registerScriptTags();
          Analytics.registerTrackers();
          Analytics.offline(false);
          expect(Analytics.log.length).toBe(3);
          expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
          expect(Analytics.log[1]).toEqual(['create', 'UA-XXXXXX-xx', { cookieDomain: 'auto' }]);
          expect(Analytics.log[2]).toEqual(['send', 'pageview', '']);
        });
      });
    });

    it('should be online by default', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should respect being set to offline', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
      });
    });

    it('should respect being reset to online', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
        Analytics.offline(false);
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should not send any commands while offline', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(0);
      });
    });

    it('should send all queued commands when reset to online', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(0);
        Analytics.offline(false);
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['send', 'pageview', { page : '/page/here', title : '' }]);
      });
    });
  });

  describe('with classic analytics', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(false);
    }));

    describe('at startup', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.startOffline(true);
      }));

      it('should have offline set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.offline()).toBe(true);
        });
      });

      it('should have delay script tag set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.configuration.delayScriptTag).toBe(true);
        });
      });

      it('should not have sent any commands while offline', function () {
        inject(function (Analytics, $window) {
          $window._gaq.length = 0; // clear queue
          Analytics.trackPage('/page/here');
          expect($window._gaq.length).toBe(0);
        });
      });

      it('should send everything when script is added and reset to online', function () {
        inject(function (Analytics, $window) {
          $window._gaq.length = 0; // clear queue
          Analytics.registerScriptTags();
          Analytics.registerTrackers();
          Analytics.offline(false);
          expect(Analytics.log.length).toBe(3);
          expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
          expect(Analytics.log[1]).toEqual(['_setAccount', 'UA-XXXXXX-xx']);
          expect(Analytics.log[2]).toEqual(['_trackPageview']);
          expect($window._gaq.length).toBe(Analytics.log.length - 1);
          expect($window._gaq[0]).toEqual(Analytics.log[1]);
          expect($window._gaq[1]).toEqual(Analytics.log[2]);
        });
      });
    });

    it('should be online by default', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should respect being set to offline', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
      });
    });

    it('should respect being reset to online', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
        Analytics.offline(false);
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should not send any commands while offline', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect($window._gaq.length).toBe(0);
      });
    });

    it('should send all queued commands when reset to online', function () {
      inject(function (Analytics, $window) {
        Analytics.log.length = 0; // clear log
        $window._gaq.length = 0; // clear queue
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(0);
        expect($window._gaq.length).toBe(0);
        Analytics.offline(false);
        expect(Analytics.log.length).toBe(2);
        expect(Analytics.log[0]).toEqual(['_set', 'title', '']);
        expect(Analytics.log[1]).toEqual(['_trackPageview', '/page/here']);
        expect($window._gaq.length).toBe(Analytics.log.length);
        expect($window._gaq[0]).toEqual(Analytics.log[0]);
        expect($window._gaq[1]).toEqual(Analytics.log[1]);
      });
    });
  });
});
