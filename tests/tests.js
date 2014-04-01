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
module('arguments', {
    setup: function () {
        /**
         * @param {function} A Class.
         * @param {object} a Instance of class.
         */
        this.checkInstanceAndClassInGeneral = function (A, a) {
            // type
            ok(isFn(A), 'type of A is a function');
            ok(isObj(a), 'type of a is an object');

            // init()
            ok(isFn(a.init), 'a has the init function');
            ok(isFn(A.prototype.init), 'function', 'prototype of A has the init function');

            // constructor
            strictEqual(a.constructor, A, 'constructor of a is A');
            strictEqual(A.prototype.constructor, A, 'constructor in prototype of A is A (constructor is fixed)');
        }
    }
});
test('create a class without arguments', function () {
    var A = Class.create(),
        a = new A();
    this.checkInstanceAndClassInGeneral(A, a);
});
test('create a class with properties', function () {
    var A = Class.create({
        prop: 1
    });
    var a = new A();
    this.checkInstanceAndClassInGeneral(A, a);

    // prop
    ok(isDefined(a.prop), 'a has prop');
    ok(!isDefined(A.prop), 'A has not prop');
    equal(a.prop, 1, 'a.prop has correct value');
});
test('create a class with static properties', function () {
    var A = Class.create({}, {
        staticProp: 1
    });
    var a = new A();
    this.checkInstanceAndClassInGeneral(A, a);

    // static prop
    ok(!isDefined(a.staticProp), 'a has not static prop');
    ok(isDefined(A.staticProp), 'A has static prop');
    equal(A.staticProp, 1, 'A.staticProp has correct value');
});
test('create a class with properties and static properties', function () {
    var A = Class.create({
        prop: 1
    }, {
        staticProp: 2
    });
    var a = new A();
    this.checkInstanceAndClassInGeneral(A, a);

    // prop
    ok(isDefined(a.prop), 'a has prop');
    ok(!isDefined(A.prop), 'A has not prop');
    equal(a.prop, 1, 'a.prop has correct value');

    // static prop
    ok(!isDefined(a.staticProp), 'a has not static prop');
    ok(isDefined(A.staticProp), 'A has static prop');
    equal(A.staticProp, 2, 'A.staticProp has correct value');
});

/**
 * Module: inheritance.
 */
module('inheritance');
test('inheritance of properties', function () {
    var A = Class.create({
        prop: 100
    });
    var B = Class.create(A);
    var b = new B();

    equal(b.prop, 100);
    ok(!isDefined(B.prop));
});
test('inheritance of methods', function () {
    var A = Class.create({
        prop: 100,
        getProps: function () {
            return this.prop;
        }
    });
    var B = Class.create(A);
    var b = new B();

    equal(b.getProps(), 100);
    ok(!isDefined(B.getProps));
});