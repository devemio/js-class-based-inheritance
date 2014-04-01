# Simple javascript inheritance
Here is a library allows to use class-based model in javascript.

## Usage
```javascript
// namespace
var Person = {};

/** @constructor */
Person.Base = Class.create({
    /** @var */
    name: '',

    /** @override */
    init: function (name) {
        // configure
        this.name = name;
    },

    /** @final */
    getName: function (name) {
        return this.name;
    },

    sayName: function () {
        // abstract
    }
});

/** 
 * @constructor 
 * @extends Person.Base
 */
Person.Woman = Class.create(Person.Base, {
    /** @override */
    init: function (name) {
        // call parent constructor
        this.super(name + ' (woman)');
    },

    /** @override */
    sayName: function () {
        alert('My name is ' + this.getName() + '.');
    }
});

/** 
 * @constructor 
 * @extends Person.Base
 */
Person.Man = Class.create(Person.Base, {
    /** @override */
    init: function (name) {
        // call parent constructor
        this.super(name + ' (man)');
    },

    /** @override */
    sayName: function () {
        alert('My name is ' + this.getName() + '. I like rock music.');
    }
});

var john = new Person.Man('John');
john.sayName();

var aline = new Person.Woman('Aline');
aline.sayName();
```
