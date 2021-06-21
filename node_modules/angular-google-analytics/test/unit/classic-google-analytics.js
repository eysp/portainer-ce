/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('classic analytics', function() {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .useAnalytics(false)
      .logAllCalls(true)
      .enterTestMode();
  }));

  afterEach(inject(function (Analytics) {
    Analytics.log.length = 0; // clear log
  }));

  describe('required settings missing', function () {
    describe('for default ga script injection', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(undefined);
      }));

      it('should inject a script tag', function () {
        inject(function (Analytics) {
          expect(Analytics.log.length).toBe(2);
          expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
          expect(document.querySelectorAll('script[src="http://www.google-analytics.com/ga.js"]').length).toBe(0);
        });
      });

      it('should issue a warning to the log', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            expect(Analytics.log.length).toBe(2);
            expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
            expect(Analytics.log[1]).toEqual(['warn', 'No accounts to register']);
            expect($log.warn).toHaveBeenCalledWith(['No accounts to register']);
          });
        });
      });
    });
  });

  describe('enabled delayed script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should have a truthy value for delayScriptTag', function () {
      inject(function (Analytics, $location) {
        expect(Analytics.configuration.delayScriptTag).toBe(true);
      });
    });

    it('should not inject a script tag', function () {
      inject(function (Analytics) {
        expect(Analytics.log.length).toBe(0);
        expect(document.querySelectorAll('script[src="http://www.google-analytics.com/ga.js"]').length).toBe(0);
      });
    });
  });

  describe('does not support multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: 'tracker1' },
      { tracker: 'UA-12345-45' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should issue a warning to the log', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          expect(Analytics.log.length).toBe(4);
          expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
          expect(Analytics.log[1]).toEqual(['warn', 'Multiple trackers are not supported with ga.js. Using first tracker only']);
          expect($log.warn).toHaveBeenCalledWith(['Multiple trackers are not supported with ga.js. Using first tracker only']);
        });
      });
    });
  });
  
  describe('manually create script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should inject a script tag', function () {
      inject(function (Analytics) {
        Analytics.registerScriptTags();
        expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
        expect(document.querySelectorAll('script[src="http://www.google-analytics.com/ga.js"]').length).toBe(0);
      });
    });

    it('should warn and prevent a second attempt to inject a script tag', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          Analytics.registerScriptTags();
          expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
          Analytics.registerScriptTags();
          expect(Analytics.log[1]).toEqual(['warn', 'Script tags already created']);
          expect($log.warn).toHaveBeenCalledWith(['Script tags already created']);
        });
      });
    });

    describe('using the deprecated create script call', function () {
      it('should warn and inject the script tag', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            Analytics.createScriptTag();
            expect(Analytics.log.length).toBe(4);
            expect(Analytics.log[0]).toEqual(['warn', 'DEPRECATION WARNING: createScriptTag method is deprecated. Please use registerScriptTags and registerTrackers methods instead.']);
            expect(Analytics.log[1]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
            expect($log.warn).toHaveBeenCalledWith(['DEPRECATION WARNING: createScriptTag method is deprecated. Please use registerScriptTags and registerTrackers methods instead.']);
          });
        });
      });
    });
  });

  describe('automatic page tracking', function () {
    it('should inject the GA script', function () {
      inject(function (Analytics) {
        expect(Analytics.log[0]).toEqual(['inject', 'http://www.google-analytics.com/ga.js']);
        expect(document.querySelectorAll('script[src="http://www.google-analytics.com/ga.js"]').length).toBe(0);
      });
    });

    it('should generate trackPages', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.trackPage('test');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', '']);
        expect($window._gaq[1]).toEqual(['_trackPageview', 'test']);
      });
    });

    it('should generate a trackPage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope, $window) {
        $window._gaq.length = 0; // clear queue
        $rootScope.$broadcast('$routeChangeSuccess');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', '']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '']);
      });
    });
  });

  describe('NOT automatic page tracking', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should NOT generate a trackpage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope, $window) {
        $window._gaq.length = 0; // clear queue
        $rootScope.$broadcast('$routeChangeSuccess');
        expect($window._gaq.length).toBe(0);
      });
    });

    it('should generate a trackpage when explicitly called', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.trackPage('/page/here');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', '']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '/page/here']);
      });
    });
  });

  describe('event tracking', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should generate eventTracks', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.trackEvent('test');
        expect($window._gaq.length).toBe(1);
        expect($window._gaq[0]).toEqual(['_trackEvent', 'test', undefined, undefined, undefined, false]);
      });
    });

    it('should generate eventTracks with non-interactions', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.trackEvent('test', 'action', 'label', 0, true);
        expect($window._gaq.length).toBe(1);
        expect($window._gaq[0]).toEqual(['_trackEvent', 'test', 'action', 'label', 0, true]);
      });
    });
  });

  describe('supports dc.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useDisplayFeatures(true);
    }));

    it('should inject the DC script and not the analytics script', function () {
      inject(function (Analytics) {
        expect(Analytics.log[0]).toEqual(['inject', '//stats.g.doubleclick.net/dc.js']);
        expect(document.querySelectorAll('script[src="//www.google-analytics.com/ga.js"]').length).toBe(0);
        expect(document.querySelectorAll('script[src="//stats.g.doubleclick.net/dc.js"]').length).toBe(0);
      });
    });
  });

  describe('e-commerce transactions', function () {
    it('should add transcation', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect($window._gaq.length).toBe(1);
        expect($window._gaq[0]).toEqual(['_addTrans', '1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands']);
      });
    });

    it('should add an item to transaction', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect($window._gaq.length).toBe(1);
        expect($window._gaq[0]).toEqual(['_addItem', '1', 'sku-1', 'Test product 1', 'Testing', '1', '1']);
        Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[1]).toEqual(['_addItem', '1', 'sku-2', 'Test product 2', 'Testing', '1', '1']);
      });
    });

    it('should track the transaction', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.trackTrans();
        expect($window._gaq.length).toBe(1);
        expect($window._gaq[0]).toEqual(['_trackTrans']);
      });
    });
  });

  describe('supports ignoreFirstPageLoad', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.ignoreFirstPageLoad(true);
    }));

    it('supports ignoreFirstPageLoad config', function () {
      inject(function (Analytics, $rootScope) {
        expect(Analytics.configuration.ignoreFirstPageLoad).toBe(true);
      });
    });
  });

  describe('supports arbitrary page events', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }));

    it('should inject the Analytics script', function () {
      inject(function (Analytics, $rootScope, $window) {
        $window._gaq.length = 0; // clear queue
        $rootScope.$broadcast('$stateChangeSuccess');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', '']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '']);
      });
    });
  });

  describe('supports RegExp path scrubbing', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setRemoveRegExp(new RegExp(/\/\d+?$/));
    }));

    it('should scrub urls', function () {
      inject(function (Analytics, $location) {
        $location.path('/some-crazy/page/with/numbers/123456');
        expect(Analytics.getUrl()).toBe('/some-crazy/page/with/numbers');
      });
    });
  });

  describe('parameter defaulting on trackPage', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should set url and title when no parameters provided', function () {
      inject(function (Analytics, $document, $location, $window) {
        $window._gaq.length = 0; // clear queue
        $location.path('/page/here');
        $document[0] = { title: 'title here' };
        Analytics.trackPage();
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', 'title here']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '/page/here']);
      });
    });

    it('should set title when no title provided', function () {
      inject(function (Analytics, $document, $window) {
        $window._gaq.length = 0; // clear queue
        $document[0] = { title: 'title here' };
        Analytics.trackPage('/page/here');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', 'title here']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '/page/here']);
      });
    });
  });

  describe('enabled url params tracking', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackUrlParams(true);
    }));

    it('should grab query params in the url', function () {
      inject(function (Analytics, $location) {
        $location.url('/some/page?with_params=foo&more_param=123');
        expect(Analytics.getUrl()).toContain('?with_params=foo&more_param=123');
      });
    });
  });
});
