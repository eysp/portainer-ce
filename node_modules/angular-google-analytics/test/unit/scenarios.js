/* global afterEach, before, beforeEach, console, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('universal analytics scenarios', function () {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .useECommerce(true, true)
      .setCurrency('EUR')
      .logAllCalls(true)
      .enterTestMode();
  }));

  afterEach(inject(function (Analytics) {
    Analytics.log.length = 0; // clear log
  }));

  it('should handle e-commerce scenario #1', function () {
    inject(function ($window) {
      spyOn($window, 'ga');
      inject(function (Analytics) {
        var i, count, expected = [
          ['inject', '//www.google-analytics.com/analytics.js'], // This entry is in the log only due to test mode
          ['create', 'UA-XXXXXX-xx', { cookieDomain: 'auto' }],
          ['require', 'ec'],
          ['set', '&cu', 'EUR'],
          ['send', 'pageview', ''],
          ['send', 'pageview', {page: '/foobar', title: ''}],
          ['ec:addProduct', {id: 'sku-2', name: 'Test Product 2', category: 'Category-1', brand: 'Brand 2', variant: 'variant-3', price: '2499', quantity: '1', coupon: 'FLAT10', position: '1'}],
          ['ec:setAction', 'checkout', {step: 1, option: 'Visa'}],
          ['ec:addProduct', {id: 'sku-2', name: 'Test Product 2', category: 'Category-1', brand: 'Brand 2', variant: 'variant-3', price: '1111', quantity: '1', coupon: 'WOMEN10', position: '1'}],
          ['ec:setAction', 'purchase', {id: 'T1234', affiliation: 'Online Store - Web', revenue: '3333', tax: '10', shipping: '200', coupon: 'FLAT10'}]
        ];
        Analytics.trackPage('/foobar');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1'); 
        Analytics.trackCheckout(1, 'Visa');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '1111', '1', 'WOMEN10', '1');
        Analytics.trackTransaction('T1234', 'Online Store - Web', '3333', '10', '200', 'FLAT10', '', '', '');
        count = $window.ga.calls.count();
        expect(count).toBe(expected.length - 1);
        expect(Analytics.log.length).toBe(expected.length);
        expect(Analytics.log[0]).toEqual(expected[0]);
        for (i = 0; i < count; ++i) {
          expect(Analytics.log[i]).toEqual(expected[i]);
          expect(Analytics.log[i + 1]).toEqual($window.ga.calls.argsFor(i));
        }
      });
    });
  });
});
