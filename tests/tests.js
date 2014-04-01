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
            strictEqual(typeof A, 'function', 'type of A is a function');
            strictEqual(typeof a, 'object', 'type of a is an object');

            // init()
            strictEqual(typeof a.init, 'function', 'a has the init function');
            strictEqual(typeof A.prototype.init, 'function', 'prototype of A has the init function');

            // constructor
            strictEqual(a.constructor, A, 'constructor of a is A');
            strictEqual(A.prototype.constructor, A, 'constructor in prototype of A is A (constructor is fixed)');
        }
    }
});
test('Class.create() without arguments', function () {
    var A = Class.create(),
        a = new A();

    this.checkInstanceAndClassInGeneral(A, a);
});
test('Class.create() with properties', function () {
    var A = Class.create({
        prop: 1
    });
    var a = new A();

    this.checkInstanceAndClassInGeneral(A, a);

    // prop
    notStrictEqual(typeof a.prop, 'undefined', 'a has prop');
    strictEqual(typeof A.prop, 'undefined', 'A has not prop');
    strictEqual(a.prop, 1, 'a.prop has correct value');
});
test('Class.create() with static properties', function () {
    var A = Class.create({}, {
        staticProp: 1
    });
    var a = new A();

    this.checkInstanceAndClassInGeneral(A, a);

    // static prop
    strictEqual(typeof a.staticProp, 'undefined', 'a has not static prop');
    notStrictEqual(typeof A.staticProp, 'undefined', 'A has static prop');
    strictEqual(A.staticProp, 1, 'A.staticProp has correct value');
});
test('Class.create() with properties and static properties', function () {
    var A = Class.create({
        prop: 1
    }, {
        staticProp: 2
    });
    var a = new A();

    this.checkInstanceAndClassInGeneral(A, a);

    // prop
    notStrictEqual(typeof a.prop, 'undefined', 'a has prop');
    strictEqual(typeof A.prop, 'undefined', 'A has not prop');
    strictEqual(a.prop, 1, 'a.prop has correct value');

    // static prop
    strictEqual(typeof a.staticProp, 'undefined', 'a has not static prop');
    notStrictEqual(typeof A.staticProp, 'undefined', 'A has static prop');
    strictEqual(A.staticProp, 2, 'A.staticProp has correct value');
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

    ok(b.prop == 100);
    strictEqual(typeof B.prop, 'undefined');
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

    ok(b.getProps() == 100);
    strictEqual(typeof B.getProps, 'undefined');
});