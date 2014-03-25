/**
 * @version 1.0.1
 * @throws {Error}
 */

(function (Global) {
    // use strict mode
    "use strict";

    if (typeof Global.Class !== 'undefined') {
        throw new Error("The 'Class' global variable has already been defined");
    }

    /**
     * Helper.
     *
     * @type {object}
     */
    var Helper = {
        /**
         * Extend function.
         *
         * @param {object} destination Destination object.
         * @param {object} source Source object.
         * @return {object} Extended object.
         */
        extend: function (destination, source) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    destination[key] = source[key];
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
        /** @constructor */
        var ClassWrapper = function (parent) {
            var hasParent = typeof parent !== 'undefined' && parent !== null;

            /** @constructor */
            var Class = function () {
                // call the function which is used as a constructor
                this.init.apply(this, arguments);
            }

            // inherit
            if (hasParent) {
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
             *   - props is an object which contains class properties
             *
             * @param {function|object|null} The parameter can be parent or props or null. 
             * @param {object} The parameter is props.
             * @return {function} A function which can be used as a class.
             * @throws {TypeError}
             */
            create: function () {
                var wrapper = null,
                    parent = null,
                    props = {},
                    args = arguments;

                // Class.create(parent|props)
                if (args.length === 1) {
                    if (typeof args[0] === 'function') {
                        parent = args[0];
                    } else if (typeof args[0] === 'object') {
                        props = args[0];
                    } else {
                        throw new TypeError('Invalid arguments');
                    }
                }

                // Class.create(parent, props)
                if (args.length >= 2) {
                    if (typeof args[0] !== 'function' || typeof args[1] !== 'object') {
                        throw new TypeError('Invalid arguments');
                    }

                    parent = args[0];
                    props = args[1];
                }

                wrapper = new ClassWrapper(parent);
                Helper.extend(wrapper.fn, props);
                return wrapper;
            }
        };
    })();
})(this);