/**
 * Helpers functions.
 */
var isDefined = function(o) {
    return typeof o !== 'undefined';
}

var isFn = function(o) {
    return typeof o === 'function';
}

var isObj = function(o) {
    return typeof o === 'object';
}

/**
 * Module: arguments.
 */
module('arguments');
test('create a class with properties', function() {
    var A = Class.create({prop: 100});

    equal(new A().prop, 100);
    ok(!isDefined(A.prop));
});
test('create a class with static properties', function() {
    var A = Class.create({}, {staticProp: 200});

    equal(A.staticProp, 200);
    ok(!isDefined(new A().staticProp));
});
test('create a class with properties and static properties', function() {
    var A = Class.create({prop: 100}, {staticProp: 200});

    equal(new A().prop, 100);
    equal(A.staticProp, 200);
    ok(!isDefined(new A().staticProp));
    ok(!isDefined(A.prop));
});

/**
 * Module: general.
 */
module('general');
test('check availability', function() {
    ok(isDefined(Class));
    ok(isFn(Class.create));
});
test('create a class', function() {
    var A = Class.create(),
        B = Class.create(A);

    ok(isFn(A));
    ok(isFn(B));
    ok(isObj(new A()));
    ok(isObj(new B()));

    ok(isFn(new A().init));
    ok(isFn(new B().init));
    ok(isFn(A.prototype.init));
    ok(isFn(B.prototype.init));

    strictEqual(new A().constructor, A);
    strictEqual(new B().constructor, B);
    strictEqual(A.prototype.constructor, A);
    strictEqual(B.prototype.constructor, B);
});
test('set properties using constructor', function() {
    var A = Class.create({
        value: '__aaa__',
        init: function(value) {
            this.value = value;
        }
    });

    var B = Class.create(A, {
        value: '__bbb__'
    });

    var C = Class.create(A, {
        init: function(value) {
            this.value += value;
        }
    });

    var D = Class.create(B, {
        init: function(value) {
            this.value += value;
        }
    });

    equal((new A('aaa')).value, 'aaa');
    equal((new B('bbb')).value, 'bbb');
    equal((new C('ccc')).value, '__aaa__ccc');
    equal((new D('ddd')).value, '__bbb__ddd');
});
test('inherit a method', function() {
    var A = Class.create({
        m1: function() {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        m2: function() {
            return 'bbb';
        }
    });

    equal(new B().m1(), 'aaa');
    equal(new B().m2(), 'bbb');

    ok(!isDefined(new A().m2));
});
test('override a method', function() {
    var A = Class.create({
        m1: function() {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        /** @override */
        m1: function() {
            return 'bbb';
        }
    });

    equal(new A().m1(), 'aaa');
    equal(new B().m1(), 'bbb');
});
test('call a parent method using this.super()', function() {
    var A = Class.create({
        name: '',
        init: function(name) {
            this.name = name;
        },
        m1: function() {
            return this.name;
        }
    });

    var B = Class.create(A, {
        m1: function(msg) {
            msg = msg || '';
            return this.super() + 'bbb' + msg;
        },
    });

    var C = Class.create(B, {
        init: function(name) {
            this.super(name);
        },
        m1: function() {
            return this.super('__msg__') + 'ccc';
        },
    });

    equal(new A('aaa').m1(), 'aaa');
    equal(new B('aaa').m1(), 'aaabbb');
    equal(new C('aaa').m1(), 'aaabbb__msg__ccc');
});
test('call a parent method using __super__', function() {
    var A = Class.create({
        m1: function() {
            return 'aaa';
        }
    });

    var B = Class.create(A, {
        m1: function() {
            return B.__super__.m1.apply(this, arguments) + 'bbb';
        },
    });

    equal(new B().m1(), 'aaabbb');
});
test('test the instanceof method', function() {
    var A = Class.create(),
        B = Class.create(A),
        C = Class.create(B);

    ok(new A() instanceof A);
    ok(!(new A() instanceof B));
    ok(!(new A() instanceof C));

    ok(new B() instanceof A);
    ok(new B() instanceof B);
    ok(!(new B() instanceof C));

    ok(new C() instanceof A);
    ok(new C() instanceof B);
    ok(new C() instanceof C);
});