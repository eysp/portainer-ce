/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('universal analytics', function () {
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

  describe('required settings missing', function () {
    describe('for analytics script injection', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(undefined);
      }));

      it('should inject a script tag', function () {
        inject(function (Analytics) {
          expect(Analytics.log.length).toBe(2);
          expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
          expect(document.querySelectorAll('script[src="//www.google-analytics.com/analytics.js"]').length).toBe(0);
        });
      });

      it('should issue a warning to the log', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            expect(Analytics.log.length).toBe(2);
            expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
            expect(Analytics.log[1]).toEqual(['warn', 'No accounts to register']);
            expect($log.warn).toHaveBeenCalledWith(['No accounts to register']);
          });
        });
      });
    });
  });

  describe('delay script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should have a truthy value for Analytics.delayScriptTag', function () {
      inject(function (Analytics, $location) {
        expect(Analytics.configuration.delayScriptTag).toBe(true);
      });
    });

    it('should not inject a script tag', function () {
      inject(function (Analytics) {
        expect(Analytics.log.length).toBe(0);
        expect(document.querySelectorAll('script[src="//www.google-analytics.com/analytics.js"]').length).toBe(0);
      });
    });
  });

  describe('automatically create analytics script tag', function () {
    it('should inject the script tag', function () {
      inject(function (Analytics) {
        expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
        expect(document.querySelectorAll('script[src="//www.google-analytics.com/analytics.js"]').length).toBe(0);
      });
    });

    it('should warn and prevent a second attempt to inject a script tag', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
          Analytics.registerScriptTags();
          expect($log.warn).toHaveBeenCalledWith(['Script tags already created']);
        });
      });
    });
  });

  describe('manually create analytics script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should inject the script tag', function () {
      inject(function (Analytics, $location) {
          Analytics.log.length = 0; // clear log
          Analytics.registerScriptTags();
          expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
      });
    });

    it('should warn and prevent a second attempt to inject a script tag', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          Analytics.log.length = 0; // clear log
          Analytics.registerScriptTags();
          expect(Analytics.log[0]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
          Analytics.registerScriptTags();
          expect($log.warn).toHaveBeenCalledWith(['Script tags already created']);
        });
      });
    });

    describe('with a prefix set', function(){
      beforeEach(module(function (AnalyticsProvider){
        AnalyticsProvider
          .trackPrefix("test-prefix");
      }));

      it('should send the url, including the prefix', function(){
        inject(function (Analytics) {
          Analytics.log.length = 0; // clear log
          Analytics.registerScriptTags();
          Analytics.registerTrackers();
          expect(Analytics.log[2]).toEqual(['send', 'pageview', 'test-prefix']);
        });
      });
    });

    describe('using the deprecated create script call', function () {
      it('should warn and inject the script tag', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            Analytics.log.length = 0; // clear log
            Analytics.createAnalyticsScriptTag();
            expect(Analytics.log.length).toBe(4);
            expect(Analytics.log[0]).toEqual(['warn', 'DEPRECATION WARNING: createAnalyticsScriptTag method is deprecated. Please use registerScriptTags and registerTrackers methods instead.']);
            expect(Analytics.log[1]).toEqual(['inject', '//www.google-analytics.com/analytics.js']);
            expect($log.warn).toHaveBeenCalledWith(['DEPRECATION WARNING: createAnalyticsScriptTag method is deprecated. Please use registerScriptTags and registerTrackers methods instead.']);
          });
        });
      });

      it('should support cookie config', function () {
        inject(function (Analytics) {
          Analytics.createAnalyticsScriptTag({ userId: 1234 });
          expect(Analytics.getCookieConfig()).toEqual({ userId: 1234 });
        });
      });
    });
  });

  describe('hybrid mobile application support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider
        .setHybridMobileSupport(true)
        .delayScriptTag(true);
    }));

    it('should support hybridMobileSupport', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.hybridMobileSupport).toBe(true);
      });
    });

    it('should inject a script tag with the HTTPS protocol and set checkProtocolTask to null', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.registerScriptTags();
        Analytics.registerTrackers();
        expect(Analytics.log[0]).toEqual(['inject', 'https://www.google-analytics.com/analytics.js']);
        expect(Analytics.log[1]).toEqual(['create', 'UA-XXXXXX-xx', { cookieDomain: 'auto' }]);
        expect(Analytics.log[2]).toEqual(['set', 'checkProtocolTask', null]);
      });
    });
  });

  describe('account custom set commands support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider
        .setAccount({
          tracker: 'UA-XXXXXX-xx',
          set: {
            forceSSL: true
          }
        })
        .setHybridMobileSupport(true)
        .delayScriptTag(true);
    }));

    it('should set the account object to use forceSSL', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.registerScriptTags();
        Analytics.registerTrackers();
        expect(Analytics.log[0]).toEqual(['inject', 'https://www.google-analytics.com/analytics.js']);
        expect(Analytics.log[1]).toEqual(['create', 'UA-XXXXXX-xx', { cookieDomain: 'auto' }]);
        expect(Analytics.log[2]).toEqual(['set', 'checkProtocolTask', null]);
        expect(Analytics.log[3]).toEqual(['set', 'forceSSL', true]);
      });
    });
  });

  describe('account select support', function () {
    var account;

    beforeEach(module(function (AnalyticsProvider) {
       account = {
        tracker: 'UA-XXXXXX-xx',
        select: function () {
          return false;
        }
      };
      spyOn(account, 'select');
      AnalyticsProvider.setAccount(account);
    }));

    it('should not run with commands after configuration when select returns false', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.trackPage('/path/to', 'title');
        expect(Analytics.log.length).toEqual(0);
        expect(account.select).toHaveBeenCalledWith(['send', 'pageview', { page: '/path/to', title: 'title' }]);
      });
    });
  });

  describe('ignoreFirstPageLoad configuration support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.ignoreFirstPageLoad(true);
    }));

    it('should support ignoreFirstPageLoad', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.ignoreFirstPageLoad).toBe(true);
      });
    });
  });

  describe('cookie configuration support', function () {
    var cookieConfig = {
      cookieDomain: 'foo.example.com',
      cookieName: 'myNewName',
      cookieExpires: 20000
    };

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setCookieConfig(cookieConfig);
    }));

    it('should support cookie config', function () {
      inject(function (Analytics) {
        expect(Analytics.getCookieConfig()).toEqual(cookieConfig);
      });
    });
  });

  describe('displayFeature configuration support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useDisplayFeatures(true);
    }));

    it('should support displayFeatures config', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.displayFeatures).toBe(true);
      });
    });
  });

  describe('enhancedLinkAttribution configuration support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useEnhancedLinkAttribution(true);
    }));

    it('should support enhancedLinkAttribution config', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.enhancedLinkAttribution).toBe(true);
      });
    });
  });

  describe('experiment configuration support', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setExperimentId('12345');
    }));

    it('should support experimentId config', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.experimentId).toBe('12345');
      });
    });
  });

  describe('supports custom events, dimensions, and metrics', function () {
    it('should allow sending custom events', function () {
      inject(function (Analytics) {
        var social = {
          hitType: 'social',
          socialNetwork: 'facebook',
          socialAction: 'like',
          socialTarget: 'http://mycoolpage.com',
          page: '/my-new-page'
        };
        Analytics.log.length = 0; // clear log
        Analytics.send(social);
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['send', social]);
      });
    });

    it('should allow setting custom dimensions, metrics or experiment', function () {
      inject(function (Analytics) {
        var data = {
          name: 'dimension1',
          value: 'value1'
        };
        Analytics.log.length = 0; // clear log
        Analytics.set(data.name, data.value);
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['set', data.name, data.value]);
      });
    });

    describe('with eventTracks', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.trackPages(false);
      }));

      it('should generate eventTracks', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.log.length = 0; // clear log
            Analytics.trackEvent('test');
            expect(Analytics.log.length).toBe(1);
            expect($window.ga).toHaveBeenCalledWith('send', 'event', 'test', undefined, undefined, undefined, { page: '' });
          });
        });
      });

      it('should generate eventTracks and honor non-interactions', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.log.length = 0; // clear log
            Analytics.trackEvent('test', 'action', 'label', 0, true);
            expect(Analytics.log.length).toBe(1);
            expect($window.ga).toHaveBeenCalledWith('send', 'event', 'test', 'action', 'label', 0, { nonInteraction: true, page: '' });
          });
        });
      });
    });
  });

  describe('e-commerce transactions with analytics.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useECommerce(true);
    }));

    it('should have e-commerce enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.ecommerce).toBe(true);
      });
    });

    it('should have enhanced e-commerce disabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.enhancedEcommerce).toBe(false);
      });
    });

    it('should add transcation', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0][0]).toEqual('ecommerce:addTransaction');
      });
    });

    it('should add an item to transaction', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0][0]).toEqual('ecommerce:addItem');
      });
    });

    it('should track the transaction', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.trackTrans();
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['ecommerce:send']);
      });
    });

    it('should allow transaction clearing', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.clearTrans();
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['ecommerce:clear']);
      });
    });

    it('should not support enhanced e-commerce commands', function () {
      var commands = [
        'addImpression',
        'addProduct',
        'addPromo',
        'setAction'
      ];

      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          commands.forEach(function (command) {
            Analytics[command]();
            expect($log.warn).toHaveBeenCalledWith(['Enhanced Ecommerce must be enabled to use ' + command + ' with analytics.js']);
          });
        });
      });
    });

    describe('supports multiple tracking objects', function () {
      var trackers = [
        { tracker: 'UA-12345-12', name: 'tracker1', trackEcommerce: true },
        { tracker: 'UA-12345-34', name: 'tracker2', trackEcommerce: false },
        { tracker: 'UA-12345-45', trackEcommerce: true }
      ];

      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(trackers);
      }));

      it('should track transactions for configured tracking objects only', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.log.length = 0; // clear log
            Analytics.trackTrans();
            expect(Analytics.log.length).toBe(2);
            expect($window.ga).toHaveBeenCalledWith('tracker1.ecommerce:send');
            expect($window.ga).toHaveBeenCalledWith('ecommerce:send');
          });
        });
      });
    });
  });

  describe('enhanced e-commerce transactions with analytics.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useECommerce(true, true);
    }));

    it('should have ecommerce disabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.ecommerce).toBe(false);
      });
    });

    it('should have enhanced ecommerce enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.configuration.enhancedEcommerce).toBe(true);
      });
    });

    it('should add product impression', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addImpression('sku-1', 'Test Product 1', 'Category List', 'Brand 1', 'Category-1', 'variant-1', '1', '24990');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0][0]).toBe('ec:addImpression');
      });
    });

    it('should add product data', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.log.length = 0; // clear log
          Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
          expect(Analytics.log.length).toBe(1);
          expect($window.ga).toHaveBeenCalledWith(
            'ec:addProduct',
            {
              id: 'sku-2',
              name: 'Test Product 2',
              category: 'Category-1',
              brand: 'Brand 2',
              variant: 'variant-3',
              price: '2499',
              quantity: '1',
              coupon: 'FLAT10',
              position: '1'
            });
        });
      });
    });

    it('should add product data with custom properties', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.log.length = 0; // clear log
          Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', undefined, undefined, { dimension1: '1' });
          expect(Analytics.log.length).toBe(1);
          expect($window.ga).toHaveBeenCalledWith(
            'ec:addProduct',
            {
              id: 'sku-2',
              name: 'Test Product 2',
              category: 'Category-1',
              brand: 'Brand 2',
              variant: 'variant-3',
              price: '2499',
              quantity: '1',
              coupon: undefined,
              position: undefined,
              dimension1: '1'
            });
        });
      });
    });

    it('should add promo data', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0][0]).toBe('ec:addPromo');
      });
    });

    it('should set action', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.setAction('dummy');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['ec:setAction', 'dummy', undefined]);
      });
    });

    it('should track product click', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.productClick('dummy list');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'click', { list: 'dummy list' } ]);
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'UX', 'click', 'dummy list', undefined, { page: '' } ]);
      });
    });

    it('should track product detail', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackDetail();
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'detail', undefined ]);
        expect(Analytics.log[2]).toEqual(['send', 'pageview']);
      });
    });

    it('should track add to cart event', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('add');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'add', { list: undefined } ]);
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'UX', 'click', 'add to cart', undefined, { page: '' } ]);
      });
    });

    it('should track add to cart event with product list', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('add', 'product-list');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'add', { list: 'product-list' } ]);
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'UX', 'click', 'add to cart', undefined, { page: '' } ]);
      });
    });

    it('should track remove from cart event', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('remove');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'remove', { list: undefined } ]);
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'UX', 'click', 'remove from cart', undefined, { page: '' } ]);
      });
    });

    it('should track remove from cart event with product list', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('remove', 'product-list');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1]).toEqual([ 'ec:setAction', 'remove', {list: 'product-list'} ]);
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'UX', 'click', 'remove from cart', undefined, { page: '' } ]);
      });
    });

    it('should track checkout', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCheckout();
        expect(Analytics.log.length).toBe(2);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1][0]).toBe('ec:setAction');
        expect(Analytics.log[1][1]).toBe('checkout');
      });
    });

    it('should track transaction', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.addProduct('sku-3', 'Test Product 3', 'Category-1', 'Brand 2', 'variant-5', '299', '1', 'FLAT10', '1');
        Analytics.trackTransaction();
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addProduct');
        expect(Analytics.log[1][0]).toBe('ec:addProduct');
        expect(Analytics.log[2][0]).toBe('ec:setAction');
        expect(Analytics.log[2][1]).toBe('purchase');
      });
    });

    it('should track promo click', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        Analytics.promoClick('Summer Sale');
        expect(Analytics.log.length).toBe(3);
        expect(Analytics.log[0][0]).toBe('ec:addPromo');
        expect(Analytics.log[1][0]).toBe('ec:setAction');
        expect(Analytics.log[1][1]).toBe('promo_click');
        expect(Analytics.log[2]).toEqual([ 'send', 'event', 'Internal Promotions', 'click', 'Summer Sale', undefined, { page: '' } ]);
      });
    });

    it('should not support ecommerce commands', function () {
      var commands = [
        'addItem',
        'addTrans',
        'clearTrans',
        'trackTrans'
      ];

      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          commands.forEach(function (command) {
            Analytics[command]();
            expect($log.warn).toHaveBeenCalledWith([command + ' is not available when Enhanced Ecommerce is enabled with analytics.js']);
          });
        });
      });
    });

    describe('supports multiple tracking objects', function () {
      var trackers = [
        { tracker: 'UA-12345-12', name: 'tracker1', trackEcommerce: false },
        { tracker: 'UA-12345-34', name: 'tracker2', trackEcommerce: true },
        { tracker: 'UA-12345-45', trackEcommerce: true }
      ];

      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(trackers);
      }));

      it('should add product for configured tracking objects only', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.log.length = 0; // clear log
            Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
            expect(Analytics.log.length).toBe(2);
            expect($window.ga).toHaveBeenCalledWith(
              'ec:addProduct',
              {
                id: 'sku-2',
                name: 'Test Product 2',
                category: 'Category-1',
                brand: 'Brand 2',
                variant: 'variant-3',
                price: '2499',
                quantity: '1',
                coupon: 'FLAT10',
                position: '1'
              });
            expect($window.ga).toHaveBeenCalledWith(
              'tracker2.ec:addProduct',
              {
                id: 'sku-2',
                name: 'Test Product 2',
                category: 'Category-1',
                brand: 'Brand 2',
                variant: 'variant-3',
                price: '2499',
                quantity: '1',
                coupon: 'FLAT10',
                position: '1'
              });
          });
        });
      });
    });
  });

  describe('supports arbitrary page events', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }));

    it('should respond to non-default page event', function () {
      inject(function (Analytics, $rootScope) {
        Analytics.log.length = 0; // clear log
        $rootScope.$broadcast('$stateChangeSuccess');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual([ 'send', 'pageview', { page: '', title: '' } ]);
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
      inject(function (Analytics, $document, $location) {
        $location.path('/page/here');
        $document[0] = { title: 'title here' };
        Analytics.log.length = 0; // clear log
        Analytics.trackPage();
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual([ 'send', 'pageview', { page: '/page/here', title: 'title here' } ]);
      });
    });

    it('should set title when no title provided', function () {
      inject(function (Analytics, $document) {
        $document[0] = { title: 'title here' };
        Analytics.log.length = 0; // clear log
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual([ 'send', 'pageview', { page: '/page/here', title: 'title here' } ]);
      });
    });
  });

  describe('supports multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: 'tracker1' },
      { tracker: 'UA-12345-34', name: 'tracker2' },
      { tracker: 'UA-12345-45' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should call create event for each tracker', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('create', trackers[0].tracker, { cookieDomain: 'auto', name: trackers[0].name });
          expect($window.ga).toHaveBeenCalledWith('create', trackers[1].tracker, { cookieDomain: 'auto', name: trackers[1].name });
          expect($window.ga).toHaveBeenCalledWith('create', trackers[2].tracker, { cookieDomain: 'auto' });
        });
      });
    });

    it('should call send pageview event for each tracker', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.trackPage('/mypage', 'My Page');
          expect($window.ga).toHaveBeenCalledWith(trackers[0].name + '.send', 'pageview', { page: '/mypage', title: 'My Page' });
          expect($window.ga).toHaveBeenCalledWith(trackers[1].name + '.send', 'pageview', { page: '/mypage', title: 'My Page' });
          expect($window.ga).toHaveBeenCalledWith('send', 'pageview', { page: '/mypage', title: 'My Page' });
        });
      });
    });
  });

  describe('supports advanced options for multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: 'tracker1', crossDomainLinker: true },
      { tracker: 'UA-12345-34', name: 'tracker2', crossDomainLinker: true, crossLinkDomains: ['domain-1.com'] },
      { tracker: 'UA-12345-45', crossDomainLinker: true, crossLinkDomains: ['domain-2.com'] },
      { tracker: 'UA-12345-67', cookieConfig: 'yourdomain.org' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should call require for each tracker', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('tracker1.require', 'linker');
          expect($window.ga).toHaveBeenCalledWith('tracker2.require', 'linker');
          expect($window.ga).toHaveBeenCalledWith('require', 'linker');
        });
      });
    });

    it('should call linker autoLink for configured tracking objects only', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).not.toHaveBeenCalledWith('tracker1.linker:autoLink');
          expect($window.ga).toHaveBeenCalledWith('tracker2.linker:autoLink', ['domain-1.com']);
          expect($window.ga).toHaveBeenCalledWith('linker:autoLink', ['domain-2.com']);
        });
      });
    });

    it ('should call create with custom cookie config', function() {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('create', 'UA-12345-67', { cookieDomain: 'yourdomain.org' });
        });
      });
    });
  });

  describe('supports advanced tracking for multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: 'tracker1', trackEvent: true },
      { tracker: 'UA-12345-34', name: 'tracker2' },
      { tracker: 'UA-12345-45', trackEvent: true }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should track events for configured tracking objects only', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.trackEvent('category', 'action', 'label', 'value');
          expect($window.ga).toHaveBeenCalledWith('tracker1.send', 'event', 'category', 'action', 'label', 'value', { page: '' });
          expect($window.ga).not.toHaveBeenCalledWith('tracker2.send', 'event', 'category', 'action', 'label', 'value', { page: '' });
          expect($window.ga).toHaveBeenCalledWith('send', 'event', 'category', 'action', 'label', 'value', { page: '' });
        });
      });
    });

    it('should track user timings for all objects', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.trackTimings('Time to Checkout', 'User Timings', '32', 'My Timings');
          expect($window.ga).toHaveBeenCalledWith('tracker1.send', 'timing', 'Time to Checkout', 'User Timings', '32', 'My Timings');
          expect($window.ga).toHaveBeenCalledWith('tracker2.send', 'timing', 'Time to Checkout', 'User Timings', '32', 'My Timings');
          expect($window.ga).toHaveBeenCalledWith('send', 'timing', 'Time to Checkout', 'User Timings', '32', 'My Timings');
        });
      });
    });

    it('should set value for default tracker if no trackerName provided', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.set('dimension1', 'metric1');
          expect($window.ga).toHaveBeenCalledWith('set', 'dimension1', 'metric1');
        });
      });
    });

    it('should set value for named tracker if a trackerName provided', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.set('dimension2', 'metric2', 'tracker1');
          expect($window.ga).toHaveBeenCalledWith('tracker1.set', 'dimension2', 'metric2');
        });
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
