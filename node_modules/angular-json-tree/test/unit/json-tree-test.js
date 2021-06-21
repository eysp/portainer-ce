describe('The json-tree directive', function () {
    'use strict';

    var scope, compile;

    beforeEach(function () {
        module('angular-json-tree');
        inject(function ($compile, $rootScope) {
            scope = $rootScope.$new();
            compile = $compile;
        });
        scope.someObject = {
            test: 'hello',
            array: [1,1,2,3,5,8],
            subObj: {
                subTest: 'hi',
                subArray: [2,1,3,4,7,11]
            }
        };
    });

    var unexpandedHtml = '<json-tree object="someObject"><json-tree>';
    var expandedHtml = '<json-tree object="someObject" start-expanded="true"><json-tree>';

    it('should generate an un-expanded tree', function () {
        var html = unexpandedHtml;
        var elem = angular.element(html);
        compile(elem)(scope);
        scope.$digest();
        expect(elem.html()).not.toMatch(/.+?<ul .+?>/);
    });

    it('should generate an expanded tree', function () {
        var html = expandedHtml;
        var elem = angular.element(html);
        compile(elem)(scope);
        scope.$digest();
        expect(elem.html()).toMatch(/.+?<ul .+?>/);
    });

    it('should have no subnodes until click', function () {
        var html = unexpandedHtml;
        var elem = angular.element(html);
        compile(elem)(scope);
        scope.$digest();
        // Shouldn't have loaded subnodes
        expect(elem.html()).not.toMatch(/.+?<ul .+?>/);
        // Click the 'key' element
        var keyElem = elem[0].querySelector('.key');
        keyElem.click();
        // Should have loaded subnodes
        expect(elem.html()).toMatch(/.+?<ul .+?>/);
    });

    it('should toggle expansion on click', function () {
        var html = unexpandedHtml;
        var elem = angular.element(html);
        compile(elem)(scope);
        scope.$digest();
        // Get 'key' element
        var keyElem = elem[0].querySelector('.key');
        // Shouldn't have expanded class
        expect(elem.html()).not.toMatch(/.+?class=".+?expanded.+?".+?>/);
        // Click the 'key' element
        keyElem.click();
        // Should have expanded class
        expect(elem.html()).toMatch(/.+?class=".+?expanded.+?".+?>/);
        // Click the 'key' element
        keyElem.click();
        // Shouldn't have expanded class
        expect(elem.html()).not.toMatch(/.+?class=".+?expanded.+?".+?>/);
    });
});
