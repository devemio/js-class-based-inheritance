# Simple javascript inheritance
Here is a library allows to use class-based model in javascript.

## Usage
```javascript
// namespace
var Shape = {};

/** @constructor */
Shape.Base = Class.create({
    /** @private */
    name: '',

    /** @override */
    init: function () {
        // configure
        this.setName('shape');
    },

    /** @final */
    setName: function (name) {
        this.name = name;
    },

    /** @final */
    getName: function (name) {
        return this.name;
    },

    draw: function () {
        // abstract
    }
});

/** 
 * @constructor 
 * @extends Shape.Base
 */
Shape.Circle = Class.create(Shape.Base, {
    /** @override */
    init: function () {
        // call parent constructor
        Shape.Circle.super.init.apply(this, arguments);

        // configure
        this.setName('circle');
    },

    /** @override */
    draw: function () {
        console.log('A ' + this.getName() + ' was drawn');
    }
});

var circle = new Shape.Circle();
circle.draw();
```
