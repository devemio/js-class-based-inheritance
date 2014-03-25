/**
 * @version 1.0.3
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
        },

        /**
         * Object.create() function.
         *
         * @param {object} prototype Object prototype.
         * @return {object}
         */
        createObject: Object.create || function (prototype) {
            var F = function () {};
            F.prototype = prototype;
            return new F();
        },

        /**
         * Parse arguments for the Class.create() method.
         *
         * @param {object} args Arguments.
         * @param {object} An object like {parent, props}.
         */
        parseArgs: function (args) {
            var parsedArgs = {};

            // parent|props
            if (args.length === 1) {
                if (typeof args[0] === 'function') {
                    parsedArgs.parent = args[0];
                } else if (typeof args[0] === 'object') {
                    parsedArgs.props = args[0];
                } else {
                    throw new TypeError('Invalid arguments');
                }
            }

            // parent, props
            if (args.length >= 2) {
                if (typeof args[0] !== 'function' || typeof args[1] !== 'object') {
                    throw new TypeError('Invalid arguments');
                }

                parsedArgs.parent = args[0];
                parsedArgs.props = args[1];
            }

            return parsedArgs;
        },

        /**
         * Inherit function.
         *
         * @param {function} parent Parent class.
         * @param {function} child Child class.
         * @return {function} inherited class.
         */
        inherit: function (parent, child) {
            // basic inherit      
            child.prototype = Helper.createObject(parent.prototype);

            // fix the constructor
            if (child.prototype.constructor === Object.prototype.constructor) {
                child.prototype.constructor = child;
            }

            // keep the superclass reference
            child.super = parent.prototype;

            // child.prototype.parent = child;

            return child;
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
    Global.Class = {
        /** 
         * Create a class.
         * Parameters can be as follows:
         *   - parent is a parent class
         *   - props is an object which contains class properties
         *
         * @param {function|object|null} The parameter can be parent or props or null. 
         * @param {object} The parameter is props (optional).
         * @return {function} A function which can be used as a class.
         * @throws {TypeError}
         */
        create: function () {
            var args = Helper.parseArgs(arguments),
                parent = args.parent || null,
                props = args.props || {},
                hasParent = parent !== null;

            /** @constructor */
            var Class = function () {
                // call the 'init' function which is used as a constructor
                this.init.apply(this, arguments);
            }

            /** function is used as a constructor */
            Class.prototype.init = function () {}

            hasParent && Helper.inherit(parent, Class);
            Helper.extend(Class.prototype, props);
            return Class;
        }
    };
})(this);