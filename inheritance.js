/**
 * @version 1.0.0
 */

(function (Global) {
    if (typeof Global.Class !== 'undefined') {
        throw new Error("The 'Class' global variable has already been defined");
    }

    /**
     * The object which contains methods to create classes.
     *
     * The init() method should be used as a constructor.
     *
     * @type {object}
     * @example Create a class.
     * - var Class = Class.create();
     * - var Class = Class.create(parentClass);
     * - var Class = Class.create({someVar: 1, someVar2: 2});
     * - var Class = Class.create(parentClass, {someVar1: 1, someVar2: 2});
     *
     * @example Call a parent method.
     * Class.super.parentMethod.apply(this, arguments);
     *
     * @example Using private variables.
     * var Person = (function() {
     *     // private
     *     var _ = {
     *         // @private
     *         isPrivateMethod: function() {
     *             return true;
     *         }
     *     };
     *
     *     // @public
     *     return Class.Create({
     *         // @constructor
     *         init: function() {
     *             console.log(_.isPrivateMethod());
     *         }
     *     });
     * })();
     */
    Global.Class = (function () {
        // use strict mode
        "use strict";

        /** @constructor */
        var ClassWrapper = function (parent) {
            /** @constructor */
            var Class = function () {
                // call the function which is used as a constructor
                this.init.apply(this, arguments);
            }

            // inherit
            if (parent) {
                // basic inherit
                var F = function () {};
                F.prototype = parent.prototype;
                Class.prototype = new F();

                // fix the constructor
                if (Class.prototype.constructor === Object.prototype.constructor) {
                    Class.prototype.constructor = Class;
                }

                // keep the superclass reference
                Class.super = parent.prototype;

                // Class.prototype.parent = Class;
            }

            // contraction of the prototype
            Class.fn = Class.prototype;

            // function is used as a constructor
            Class.fn.init = function () {}

            return Class;
        };

        return {
            /** 
             * Create a class.
             * Parameters can be as follows:
             *   - parent is a parent class
             *   - obj is an object which extends basic functionality
             *
             * @param {function|object|null} The parameter can be parent or obj or null. 
             * @param {object} The parameter is obj.
             * @return {Class} A function which can be used as a class.
             * @throws {TypeError}
             */
            create: function () {
                var wrapper = null,
                    parent = null,
                    obj = {};

                // Class.create(parent|obj)
                if (arguments.length === 1) {
                    if (typeof arguments[0] === 'function') {
                        parent = arguments[0];
                    } else if (typeof arguments[0] === 'object') {
                        obj = arguments[0];
                    } else {
                        throw new TypeError('Invalid arguments');
                    }
                }

                // Class.create(parent, obj)
                if (arguments.length >= 2) {
                    if (typeof arguments[0] !== 'function' || typeof arguments[1] !== 'object') {
                        throw new TypeError('Invalid arguments');
                    }

                    parent = arguments[0];
                    obj = arguments[1];
                }

                wrapper = new ClassWrapper(parent);
                this.mixin(wrapper.fn, obj);
                return wrapper;
            },

            /**
             * Mixin function.
             *
             * @param {object} destination Destination object.
             * @param {object} props Source object.
             * @return {object} Mixed object.
             */
            mixin: function (destination, props) {
                for (var key in props) {
                    if (props.hasOwnProperty(key)) {
                        destination[key] = props[key];
                    }
                }
                return destination;
            },

            /**
             * Proxy function.
             *
             * @param {function} f Some function.
             * @return {function}
             */
            proxy: function (f) {
                var self = this;
                return (function () {
                    return f.apply(self, arguments);
                });
            }
        };
    })();
})(this);