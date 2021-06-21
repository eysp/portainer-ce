describe('angular-clipboard', function () {
    var elm, scope;

    beforeEach(angular.mock.module('angular-clipboard'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile) {
        scope = $rootScope;
        elm = $compile('<button clipboard supported="supported" text="textToCopy" on-copied="success()" on-error="fail(err)">Copy</button>')(scope);

        scope.supported = undefined;
        scope.textToCopy = 'Copy me!';
        scope.copied = false;
        scope.success = function () {scope.copied = true;};
        scope.fail = function (err) {};
        scope.$digest();

        spyOn(scope, 'success').and.callThrough();
        spyOn(scope, 'fail');
    }));

    it('should invoke success callback after successful execCommand', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.success).toHaveBeenCalled();
    });

    it('should invoke fail callback on error in execCommand', function () {
        spyOn(document, 'execCommand').and.returnValue(false);
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalledWith('failure copy');
    });

    it('should invoke fail callback on invalid child element', function () {
        spyOn(document.body, 'appendChild').and.throwError('fake');
        elm.triggerHandler('click');
        expect(scope.fail).toHaveBeenCalled();
    });

    it('should be caught by angular\'s digest cycle', function () {
        spyOn(document, 'execCommand').and.returnValue(true);
        elm.triggerHandler('click');
        expect(scope.copied).toEqual(true);
    });

    it('should export/return angular module', function () {
        expect(window.angularClipboard).toBeDefined();
        expect(window.angularClipboard.name).toEqual('angular-clipboard');
    });

    it('should feature detect and set supported', function () {
        expect(scope.supported).toEqual(true);
    });
});
