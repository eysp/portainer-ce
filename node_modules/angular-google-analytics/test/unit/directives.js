/* global before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('directives', function() {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .logAllCalls(true)
      .enterTestMode();
  }));

  describe('directives', function () {
    describe('gaTrackEvent', function () {
      it('should evaluate scope params', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[event, action, label]">test</div>',
              compiled = $compile(element)(scope);

          scope.event = 'button';
          scope.action = 'click';
          scope.label = 'Some Button';

          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should track an event when clicked', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']">test</div>',
              compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should inherit parent scope', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(), element, compiled;
          scope.event = ['button', 'click', 'Some Button'];
          element = '<div ga-track-event="event">test</div>';
          compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should abort if gaTrackEventIf is false', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']" ga-track-event-if="false">test</div>',
              compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent.calls.count()).toBe(0);

          element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']" ga-track-event-if="true">test</div>';
          compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent.calls.count()).toBe(1);
        });
      });
    });
  });
});
