/**
 * Helpers functions.
 */
var isDefined = function (o) {
    return typeof o !== 'undefined';
}

var isFn = function (o) {
    return typeof o === 'function';
}

var isObj = function (o) {
    return typeof o === 'object';
}

/**
 * Module: arguments.
 */
module('arguments');
test('create class with properties', function () {
    var A = Class.create({
        prop: 100
    });

    // prop
    ok(isDefined(new A().prop));
    ok(!isDefined(A.prop));
    equal(new A().prop, 100);
});
test('create class with static properties', function () {
    var A = Class.create({}, {
        staticProp: 200
    });

    // static prop
    ok(!isDefined(new A().staticProp));
    ok(isDefined(A.staticProp));
    equal(A.staticProp, 200);
});
test('create class with properties and static properties', function () {
    var A = Class.create({
        prop: 100
    }, {
        staticProp: 200
    });

    // prop
    ok(isDefined(new A().prop));
    ok(!isDefined(A.prop));
    equal(new A().prop, 100);

    // static prop
    ok(!isDefined(new A().staticProp));
    ok(isDefined(A.staticProp));
    equal(A.staticProp, 200);
});

/**
 * Module: general.
 */
module('general');
test('check global variable', function () {
    ok(isDefined(Class));
    ok(isFn(Class.create));
});
test('create class', function () {
    var A = Class.create();

    ok(isFn(A));
    ok(isObj(new A()));

    ok(isFn((new A()).init));
    ok(isFn(A.prototype.init));

    strictEqual((new A()).constructor, A);
    strictEqual(A.prototype.constructor, A);
});
test('set properties using constructor', function () {
    var A = Class.create({
        init: function (v) {
            this.value = v;
        }
    });

    equal((new A('aaa')).value, 'aaa');
    equal((new A('bbb')).value, 'bbb');
});
test('inherit method', function () {
    var A = Class.create({
        m1: function () {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        m2: function () {
            return 'bbb';
        }
    });

    equal(new B().m1(), 'aaa');
    equal(new B().m2(), 'bbb');

    ok(isDefined(new A().m1));
    ok(!isDefined(new A().m2));
});
test('override method', function () {
    var A = Class.create({
        m1: function () {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        /** @override */
        m1: function () {
            return 'bbb';
        }
    });

    equal(new A().m1(), 'aaa');
    equal(new B().m1(), 'bbb');
});
test('call super() method', function () {
    var A = Class.create({
        name: '',
        init: function (name) {
            this.name = name;
        },
        m1: function () {
            return this.name;
        }
    });

    var B = Class.create(A, {
        init: function () {
            this.super.apply(this, arguments);
        },
        m1: function () {
            return this.super() + 'bbb';
        },
    });

    var C = Class.create(B, {
        init: function (name) {
            this.super(name);
        },
        m1: function () {
            return this.super() + 'ccc';
        },
    });

    equal(new C('aaa').m1(), 'aaabbbccc');
});
test('call super() method', function () {
    var A = Class.create({
        m1: function () {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        m1: function () {
            return B.__super__.m1.apply(this, arguments) + 'bbb';
        },
    });

    equal(new B().m1(), 'aaabbb');
});