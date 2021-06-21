/**
 * Created by elgs on 7/2/14.
 */

(function () {
    "use strict";

    var splitargs = require('./splitargs.js');

    describe('splitargs Suite', function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('should split double quoted string', function () {
            var i = " I  said 'I am sorry.', and he said \"it doesn't matter.\" ";
            var o = splitargs(i);
            expect(7).toBe(o.length);
            expect(o[0]).toBe("I");
            expect(o[1]).toBe("said");
            expect(o[2]).toBe("I am sorry.,");
            expect(o[3]).toBe("and");
            expect(o[4]).toBe("he");
            expect(o[5]).toBe("said");
            expect(o[6]).toBe("it doesn't matter.");
        });

        it('should split pure double quoted string', function () {
            var i = "I said \"I am sorry.\", and he said \"it doesn't matter.\"";
            var o = splitargs(i);
            expect(o.length).toBe(7);
            expect(o[0]).toBe("I");
            expect(o[1]).toBe("said");
            expect(o[2]).toBe("I am sorry.,");
            expect(o[3]).toBe("and");
            expect(o[4]).toBe("he");
            expect(o[5]).toBe("said");
            expect(o[6]).toBe("it doesn't matter.");
        });

        it('should split single quoted string', function () {
            var i = 'I said "I am sorry.", and he said "it doesn\'t matter."';
            var o = splitargs(i);
            expect(o.length).toBe(7);
            expect(o[0]).toBe("I");
            expect(o[1]).toBe("said");
            expect(o[2]).toBe("I am sorry.,");
            expect(o[3]).toBe("and");
            expect(o[4]).toBe("he");
            expect(o[5]).toBe("said");
            expect(o[6]).toBe("it doesn't matter.");
        });

        it('should split pure single quoted string', function () {
            var i = 'I said \'I am sorry.\', and he said "it doesn\'t matter."';
            var o = splitargs(i);
            expect(o.length).toBe(7);
            expect(o[0]).toBe("I");
            expect(o[1]).toBe("said");
            expect(o[2]).toBe("I am sorry.,");
            expect(o[3]).toBe("and");
            expect(o[4]).toBe("he");
            expect(o[5]).toBe("said");
            expect(o[6]).toBe("it doesn't matter.");
        });

        it('should split to 4 empty strings', function () {
            var i = ',,,';
            var o = splitargs(i, ',', true);
            expect(o.length).toBe(4);
        })
    });
})();