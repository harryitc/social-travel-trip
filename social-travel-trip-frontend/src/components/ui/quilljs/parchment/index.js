(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Parchment"] = factory();
	else
		root["Parchment"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ParchmentError extends Error {
    constructor(message) {
        message = '[Parchment] ' + message;
        super(message);
        this.message = message;
        this.name = this.constructor.name;
    }
}
exports.ParchmentError = ParchmentError;
let attributes = {};
let classes = {};
let tags = {};
let types = {};
exports.DATA_KEY = '__blot';
var Scope;
(function (Scope) {
    Scope[Scope["TYPE"] = 3] = "TYPE";
    Scope[Scope["LEVEL"] = 12] = "LEVEL";
    Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
    Scope[Scope["BLOT"] = 14] = "BLOT";
    Scope[Scope["INLINE"] = 7] = "INLINE";
    Scope[Scope["BLOCK"] = 11] = "BLOCK";
    Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
    Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
    Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
    Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
    Scope[Scope["ANY"] = 15] = "ANY";
})(Scope = exports.Scope || (exports.Scope = {}));
function create(input, value) {
    let match = query(input);
    if (match == null) {
        throw new ParchmentError(`Unable to create ${input} blot`);
    }
    let BlotClass = match;
    let node = 
    // @ts-ignore
    input instanceof Node || input['nodeType'] === Node.TEXT_NODE ? input : BlotClass.create(value);
    return new BlotClass(node, value);
}
exports.create = create;
function find(node, bubble = false) {
    if (node == null)
        return null;
    // @ts-ignore
    if (node[exports.DATA_KEY] != null)
        return node[exports.DATA_KEY].blot;
    if (bubble)
        return find(node.parentNode, bubble);
    return null;
}
exports.find = find;
function query(query, scope = Scope.ANY) {
    let match;
    if (typeof query === 'string') {
        match = types[query] || attributes[query];
        // @ts-ignore
    }
    else if (query instanceof Text || query['nodeType'] === Node.TEXT_NODE) {
        match = types['text'];
    }
    else if (typeof query === 'number') {
        if (query & Scope.LEVEL & Scope.BLOCK) {
            match = types['block'];
        }
        else if (query & Scope.LEVEL & Scope.INLINE) {
            match = types['inline'];
        }
    }
    else if (query instanceof HTMLElement) {
        let names = (query.getAttribute('class') || '').split(/\s+/);
        for (let i in names) {
            match = classes[names[i]];
            if (match)
                break;
        }
        match = match || tags[query.tagName];
    }
    if (match == null)
        return null;
    // @ts-ignore
    if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope)
        return match;
    return null;
}
exports.query = query;
function register(...Definitions) {
    if (Definitions.length > 1) {
        return Definitions.map(function (d) {
            return register(d);
        });
    }
    let Definition = Definitions[0];
    if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
        throw new ParchmentError('Invalid definition');
    }
    else if (Definition.blotName === 'abstract') {
        throw new ParchmentError('Cannot register abstract class');
    }
    types[Definition.blotName || Definition.attrName] = Definition;
    if (typeof Definition.keyName === 'string') {
        attributes[Definition.keyName] = Definition;
    }
    else {
        if (Definition.className != null) {
            classes[Definition.className] = Definition;
        }
        if (Definition.tagName != null) {
            if (Array.isArray(Definition.tagName)) {
                Definition.tagName = Definition.tagName.map(function (tagName) {
                    return tagName.toUpperCase();
                });
            }
            else {
                Definition.tagName = Definition.tagName.toUpperCase();
            }
            let tagNames = Array.isArray(Definition.tagName) ? Definition.tagName : [Definition.tagName];
            tagNames.forEach(function (tag) {
                if (tags[tag] == null || Definition.className == null) {
                    tags[tag] = Definition;
                }
            });
        }
    }
    return Definition;
}
exports.register = register;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Registry = __webpack_require__(0);
class Attributor {
    static keys(node) {
        return Array.from(node.attributes).map(function (item) {
            return item.name;
        });
    }
    constructor(attrName, keyName, options = {}) {
        this.attrName = attrName;
        this.keyName = keyName;
        let attributeBit = Registry.Scope.TYPE & Registry.Scope.ATTRIBUTE;
        if (options.scope != null) {
            // Ignore type bits, force attribute bit
            this.scope = (options.scope & Registry.Scope.LEVEL) | attributeBit;
        }
        else {
            this.scope = Registry.Scope.ATTRIBUTE;
        }
        if (options.whitelist != null)
            this.whitelist = options.whitelist;
    }
    add(node, value) {
        if (!this.canAdd(node, value))
            return false;
        node.setAttribute(this.keyName, value);
        return true;
    }
    canAdd(node, value) {
        let match = Registry.query(node, Registry.Scope.BLOT & (this.scope | Registry.Scope.TYPE));
        if (match == null)
            return false;
        if (this.whitelist == null)
            return true;
        if (typeof value === 'string') {
            return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
        }
        else {
            return this.whitelist.indexOf(value) > -1;
        }
    }
    remove(node) {
        node.removeAttribute(this.keyName);
    }
    value(node) {
        let value = node.getAttribute(this.keyName);
        if (this.canAdd(node, value) && value) {
            return value;
        }
        return '';
    }
}
exports.default = Attributor;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const linked_list_1 = __webpack_require__(11);
const shadow_1 = __webpack_require__(5);
const Registry = __webpack_require__(0);
class ContainerBlot extends shadow_1.default {
    constructor(domNode) {
        super(domNode);
        this.build();
    }
    appendChild(other) {
        this.insertBefore(other);
    }
    attach() {
        super.attach();
        this.children.forEach(child => {
            child.attach();
        });
    }
    build() {
        this.children = new linked_list_1.default();
        // Need to be reversed for if DOM nodes already in order
        [].slice
            .call(this.domNode.childNodes)
            .reverse()
            .forEach((node) => {
            try {
                let child = makeBlot(node);
                this.insertBefore(child, this.children.head || undefined);
            }
            catch (err) {
                if (err instanceof Registry.ParchmentError)
                    return;
                else
                    throw err;
            }
        });
    }
    deleteAt(index, length) {
        if (index === 0 && length === this.length()) {
            return this.remove();
        }
        this.children.forEachAt(index, length, function (child, offset, length) {
            child.deleteAt(offset, length);
        });
    }
    descendant(criteria, index) {
        let [child, offset] = this.children.find(index);
        if ((criteria.blotName == null && criteria(child)) ||
            (criteria.blotName != null && child instanceof criteria)) {
            return [child, offset];
        }
        else if (child instanceof ContainerBlot) {
            return child.descendant(criteria, offset);
        }
        else {
            return [null, -1];
        }
    }
    descendants(criteria, index = 0, length = Number.MAX_VALUE) {
        let descendants = [];
        let lengthLeft = length;
        this.children.forEachAt(index, length, function (child, index, length) {
            if ((criteria.blotName == null && criteria(child)) ||
                (criteria.blotName != null && child instanceof criteria)) {
                descendants.push(child);
            }
            if (child instanceof ContainerBlot) {
                descendants = descendants.concat(child.descendants(criteria, index, lengthLeft));
            }
            lengthLeft -= length;
        });
        return descendants;
    }
    detach() {
        this.children.forEach(function (child) {
            child.detach();
        });
        super.detach();
    }
    formatAt(index, length, name, value) {
        this.children.forEachAt(index, length, function (child, offset, length) {
            child.formatAt(offset, length, name, value);
        });
    }
    insertAt(index, value, def) {
        let [child, offset] = this.children.find(index);
        if (child) {
            child.insertAt(offset, value, def);
        }
        else {
            let blot = def == null ? Registry.create('text', value) : Registry.create(value, def);
            this.appendChild(blot);
        }
    }
    insertBefore(childBlot, refBlot) {
        if (this.statics.allowedChildren != null &&
            !this.statics.allowedChildren.some(function (child) {
                return childBlot instanceof child;
            })) {
            throw new Registry.ParchmentError(`Cannot insert ${childBlot.statics.blotName} into ${this.statics.blotName}`);
        }
        childBlot.insertInto(this, refBlot);
    }
    length() {
        return this.children.reduce(function (memo, child) {
            return memo + child.length();
        }, 0);
    }
    moveChildren(targetParent, refNode) {
        this.children.forEach(function (child) {
            targetParent.insertBefore(child, refNode);
        });
    }
    optimize(context) {
        super.optimize(context);
        if (this.children.length === 0) {
            if (this.statics.defaultChild != null) {
                let child = Registry.create(this.statics.defaultChild);
                this.appendChild(child);
                child.optimize(context);
            }
            else {
                this.remove();
            }
        }
    }
    path(index, inclusive = false) {
        let [child, offset] = this.children.find(index, inclusive);
        let position = [[this, index]];
        if (child instanceof ContainerBlot) {
            return position.concat(child.path(offset, inclusive));
        }
        else if (child != null) {
            position.push([child, offset]);
        }
        return position;
    }
    removeChild(child) {
        this.children.remove(child);
    }
    replace(target) {
        if (target instanceof ContainerBlot) {
            target.moveChildren(this);
        }
        super.replace(target);
    }
    split(index, force = false) {
        if (!force) {
            if (index === 0)
                return this;
            if (index === this.length())
                return this.next;
        }
        let after = this.clone();
        this.parent.insertBefore(after, this.next);
        this.children.forEachAt(index, this.length(), function (child, offset, length) {
            child = child.split(offset, force);
            after.appendChild(child);
        });
        return after;
    }
    unwrap() {
        this.moveChildren(this.parent, this.next);
        this.remove();
    }
    update(mutations, context) {
        let addedNodes = [];
        let removedNodes = [];
        mutations.forEach(mutation => {
            if (mutation.target === this.domNode && mutation.type === 'childList') {
                addedNodes.push.apply(addedNodes, Array.from(mutation.addedNodes));
                removedNodes.push.apply(removedNodes, Array.from(mutation.removedNodes));
            }
        });
        removedNodes.forEach((node) => {
            // Check node has actually been removed
            // One exception is Chrome does not immediately remove IFRAMEs
            // from DOM but MutationRecord is correct in its reported removal
            if (node.parentNode != null &&
                // @ts-ignore
                node.tagName !== 'IFRAME' &&
                document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                return;
            }
            let blot = Registry.find(node);
            if (blot == null)
                return;
            if (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) {
                blot.detach();
            }
        });
        addedNodes
            .filter(node => {
            return node.parentNode == this.domNode;
        })
            .sort(function (a, b) {
            if (a === b)
                return 0;
            if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
                return 1;
            }
            return -1;
        })
            .forEach(node => {
            let refBlot = null;
            if (node.nextSibling != null) {
                refBlot = Registry.find(node.nextSibling);
            }
            let blot = makeBlot(node);
            if (blot.next != refBlot || blot.next == null) {
                if (blot.parent != null) {
                    blot.parent.removeChild(this);
                }
                this.insertBefore(blot, refBlot || undefined);
            }
        });
    }
}
function makeBlot(node) {
    let blot = Registry.find(node);
    if (blot == null) {
        try {
            blot = Registry.create(node);
        }
        catch (e) {
            blot = Registry.create(Registry.Scope.INLINE);
            [].slice.call(node.childNodes).forEach(function (child) {
                // @ts-ignore
                blot.domNode.appendChild(child);
            });
            if (node.parentNode) {
                node.parentNode.replaceChild(blot.domNode, node);
            }
            blot.attach();
        }
    }
    return blot;
}
exports.default = ContainerBlot;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const attributor_1 = __webpack_require__(1);
const store_1 = __webpack_require__(6);
const container_1 = __webpack_require__(2);
const Registry = __webpack_require__(0);
class FormatBlot extends container_1.default {
    static formats(domNode) {
        if (typeof this.tagName === 'string') {
            return true;
        }
        else if (Array.isArray(this.tagName)) {
            return domNode.tagName.toLowerCase();
        }
        return undefined;
    }
    constructor(domNode) {
        super(domNode);
        this.attributes = new store_1.default(this.domNode);
    }
    format(name, value) {
        let format = Registry.query(name);
        if (format instanceof attributor_1.default) {
            this.attributes.attribute(format, value);
        }
        else if (value) {
            if (format != null && (name !== this.statics.blotName || this.formats()[name] !== value)) {
                this.replaceWith(name, value);
            }
        }
    }
    formats() {
        let formats = this.attributes.values();
        let format = this.statics.formats(this.domNode);
        if (format != null) {
            formats[this.statics.blotName] = format;
        }
        return formats;
    }
    replaceWith(name, value) {
        let replacement = super.replaceWith(name, value);
        this.attributes.copy(replacement);
        return replacement;
    }
    update(mutations, context) {
        super.update(mutations, context);
        if (mutations.some(mutation => {
            return mutation.target === this.domNode && mutation.type === 'attributes';
        })) {
            this.attributes.build();
        }
    }
    wrap(name, value) {
        let wrapper = super.wrap(name, value);
        if (wrapper instanceof FormatBlot && wrapper.statics.scope === this.statics.scope) {
            this.attributes.move(wrapper);
        }
        return wrapper;
    }
}
exports.default = FormatBlot;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const shadow_1 = __webpack_require__(5);
const Registry = __webpack_require__(0);
class LeafBlot extends shadow_1.default {
    static value(domNode) {
        return true;
    }
    index(node, offset) {
        if (this.domNode === node ||
            this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
            return Math.min(offset, 1);
        }
        return -1;
    }
    position(index, inclusive) {
        let offset = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
        if (index > 0)
            offset += 1;
        return [this.parent.domNode, offset];
    }
    value() {
        return { [this.statics.blotName]: this.statics.value(this.domNode) || true };
    }
}
LeafBlot.scope = Registry.Scope.INLINE_BLOT;
exports.default = LeafBlot;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Registry = __webpack_require__(0);
class ShadowBlot {
    constructor(domNode) {
        this.domNode = domNode;
        // @ts-ignore
        this.domNode[Registry.DATA_KEY] = { blot: this };
    }
    // Hack for accessing inherited static methods
    get statics() {
        return this.constructor;
    }
    static create(value) {
        if (this.tagName == null) {
            throw new Registry.ParchmentError('Blot definition missing tagName');
        }
        let node;
        if (Array.isArray(this.tagName)) {
            if (typeof value === 'string') {
                value = value.toUpperCase();
                if (parseInt(value).toString() === value) {
                    value = parseInt(value);
                }
            }
            if (typeof value === 'number') {
                node = document.createElement(this.tagName[value - 1]);
            }
            else if (this.tagName.indexOf(value) > -1) {
                node = document.createElement(value);
            }
            else {
                node = document.createElement(this.tagName[0]);
            }
        }
        else {
            node = document.createElement(this.tagName);
        }
        if (this.className) {
            node.classList.add(this.className);
        }
        return node;
    }
    attach() {
        if (this.parent != null) {
            this.scroll = this.parent.scroll;
        }
    }
    clone() {
        let domNode = this.domNode.cloneNode(false);
        return Registry.create(domNode);
    }
    detach() {
        if (this.parent != null)
            this.parent.removeChild(this);
        // @ts-ignore
        delete this.domNode[Registry.DATA_KEY];
    }
    deleteAt(index, length) {
        let blot = this.isolate(index, length);
        blot.remove();
    }
    formatAt(index, length, name, value) {
        let blot = this.isolate(index, length);
        if (Registry.query(name, Registry.Scope.BLOT) != null && value) {
            blot.wrap(name, value);
        }
        else if (Registry.query(name, Registry.Scope.ATTRIBUTE) != null) {
            let parent = Registry.create(this.statics.scope);
            blot.wrap(parent);
            parent.format(name, value);
        }
    }
    insertAt(index, value, def) {
        let blot = def == null ? Registry.create('text', value) : Registry.create(value, def);
        let ref = this.split(index);
        this.parent.insertBefore(blot, ref);
    }
    insertInto(parentBlot, refBlot = null) {
        if (this.parent != null) {
            this.parent.children.remove(this);
        }
        let refDomNode = null;
        parentBlot.children.insertBefore(this, refBlot);
        if (refBlot != null) {
            refDomNode = refBlot.domNode;
        }
        if (this.domNode.parentNode != parentBlot.domNode ||
            this.domNode.nextSibling != refDomNode) {
            parentBlot.domNode.insertBefore(this.domNode, refDomNode);
        }
        this.parent = parentBlot;
        this.attach();
    }
    isolate(index, length) {
        let target = this.split(index);
        target.split(length);
        return target;
    }
    length() {
        return 1;
    }
    offset(root = this.parent) {
        if (this.parent == null || this == root)
            return 0;
        return this.parent.children.offset(this) + this.parent.offset(root);
    }
    optimize(context) {
        // TODO clean up once we use WeakMap
        // @ts-ignore
        if (this.domNode[Registry.DATA_KEY] != null) {
            // @ts-ignore
            delete this.domNode[Registry.DATA_KEY].mutations;
        }
    }
    remove() {
        if (this.domNode.parentNode != null) {
            this.domNode.parentNode.removeChild(this.domNode);
        }
        this.detach();
    }
    replace(target) {
        if (target.parent == null)
            return;
        target.parent.insertBefore(this, target.next);
        target.remove();
    }
    replaceWith(name, value) {
        let replacement = typeof name === 'string' ? Registry.create(name, value) : name;
        replacement.replace(this);
        return replacement;
    }
    split(index, force) {
        return index === 0 ? this : this.next;
    }
    update(mutations, context) {
        // Nothing to do by default
    }
    wrap(name, value) {
        let wrapper = typeof name === 'string' ? Registry.create(name, value) : name;
        if (this.parent != null) {
            this.parent.insertBefore(wrapper, this.next);
        }
        wrapper.appendChild(this);
        return wrapper;
    }
}
ShadowBlot.blotName = 'abstract';
exports.default = ShadowBlot;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const attributor_1 = __webpack_require__(1);
const class_1 = __webpack_require__(7);
const style_1 = __webpack_require__(8);
const Registry = __webpack_require__(0);
class AttributorStore {
    constructor(domNode) {
        this.attributes = {};
        this.domNode = domNode;
        this.build();
    }
    attribute(attribute, value) {
        // verb
        if (value) {
            if (attribute.add(this.domNode, value)) {
                if (attribute.value(this.domNode) != null) {
                    this.attributes[attribute.attrName] = attribute;
                }
                else {
                    delete this.attributes[attribute.attrName];
                }
            }
        }
        else {
            attribute.remove(this.domNode);
            delete this.attributes[attribute.attrName];
        }
    }
    build() {
        this.attributes = {};
        let attributes = attributor_1.default.keys(this.domNode);
        let classes = class_1.default.keys(this.domNode);
        let styles = style_1.default.keys(this.domNode);
        attributes
            .concat(classes)
            .concat(styles)
            .forEach(name => {
            let attr = Registry.query(name, Registry.Scope.ATTRIBUTE);
            if (attr instanceof attributor_1.default) {
                this.attributes[attr.attrName] = attr;
            }
        });
    }
    copy(target) {
        Object.keys(this.attributes).forEach(key => {
            let value = this.attributes[key].value(this.domNode);
            target.format(key, value);
        });
    }
    move(target) {
        this.copy(target);
        Object.keys(this.attributes).forEach(key => {
            this.attributes[key].remove(this.domNode);
        });
        this.attributes = {};
    }
    values() {
        return Object.keys(this.attributes).reduce((attributes, name) => {
            attributes[name] = this.attributes[name].value(this.domNode);
            return attributes;
        }, {});
    }
}
exports.default = AttributorStore;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const attributor_1 = __webpack_require__(1);
function match(node, prefix) {
    let className = node.getAttribute('class') || '';
    return className.split(/\s+/).filter(function (name) {
        return name.indexOf(`${prefix}-`) === 0;
    });
}
class ClassAttributor extends attributor_1.default {
    static keys(node) {
        return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
            return name
                .split('-')
                .slice(0, -1)
                .join('-');
        });
    }
    add(node, value) {
        if (!this.canAdd(node, value))
            return false;
        this.remove(node);
        node.classList.add(`${this.keyName}-${value}`);
        return true;
    }
    remove(node) {
        let matches = match(node, this.keyName);
        matches.forEach(function (name) {
            node.classList.remove(name);
        });
        if (node.classList.length === 0) {
            node.removeAttribute('class');
        }
    }
    value(node) {
        let result = match(node, this.keyName)[0] || '';
        let value = result.slice(this.keyName.length + 1); // +1 for hyphen
        return this.canAdd(node, value) ? value : '';
    }
}
exports.default = ClassAttributor;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const attributor_1 = __webpack_require__(1);
function camelize(name) {
    let parts = name.split('-');
    let rest = parts
        .slice(1)
        .map(function (part) {
        return part[0].toUpperCase() + part.slice(1);
    })
        .join('');
    return parts[0] + rest;
}
class StyleAttributor extends attributor_1.default {
    static keys(node) {
        return (node.getAttribute('style') || '').split(';').map(function (value) {
            let arr = value.split(':');
            return arr[0].trim();
        });
    }
    add(node, value) {
        if (!this.canAdd(node, value))
            return false;
        // @ts-ignore
        node.style[camelize(this.keyName)] = value;
        return true;
    }
    remove(node) {
        // @ts-ignore
        node.style[camelize(this.keyName)] = '';
        if (!node.getAttribute('style')) {
            node.removeAttribute('style');
        }
    }
    value(node) {
        // @ts-ignore
        let value = node.style[camelize(this.keyName)];
        return this.canAdd(node, value) ? value : '';
    }
}
exports.default = StyleAttributor;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __webpack_require__(2);
exports.ContainerBlot = container_1.default;
const format_1 = __webpack_require__(3);
exports.FormatBlot = format_1.default;
const leaf_1 = __webpack_require__(4);
exports.LeafBlot = leaf_1.default;
const scroll_1 = __webpack_require__(12);
exports.ScrollBlot = scroll_1.default;
const inline_1 = __webpack_require__(13);
exports.InlineBlot = inline_1.default;
const block_1 = __webpack_require__(14);
exports.BlockBlot = block_1.default;
const embed_1 = __webpack_require__(15);
exports.EmbedBlot = embed_1.default;
const text_1 = __webpack_require__(16);
exports.TextBlot = text_1.default;
const attributor_1 = __webpack_require__(1);
exports.Attributor = attributor_1.default;
const class_1 = __webpack_require__(7);
exports.ClassAttributor = class_1.default;
const style_1 = __webpack_require__(8);
exports.StyleAttributor = style_1.default;
const store_1 = __webpack_require__(6);
exports.AttributorStore = store_1.default;
const Registry = __webpack_require__(0);
exports.Registry = Registry;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class LinkedList {
    constructor() {
        this.head = this.tail = null;
        this.length = 0;
    }
    append(...nodes) {
        this.insertBefore(nodes[0], null);
        if (nodes.length > 1) {
            this.append.apply(this, nodes.slice(1));
        }
    }
    contains(node) {
        let cur, next = this.iterator();
        while ((cur = next())) {
            if (cur === node)
                return true;
        }
        return false;
    }
    insertBefore(node, refNode) {
        if (!node)
            return;
        node.next = refNode;
        if (refNode != null) {
            node.prev = refNode.prev;
            if (refNode.prev != null) {
                refNode.prev.next = node;
            }
            refNode.prev = node;
            if (refNode === this.head) {
                this.head = node;
            }
        }
        else if (this.tail != null) {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        else {
            node.prev = null;
            this.head = this.tail = node;
        }
        this.length += 1;
    }
    offset(target) {
        let index = 0, cur = this.head;
        while (cur != null) {
            if (cur === target)
                return index;
            index += cur.length();
            cur = cur.next;
        }
        return -1;
    }
    remove(node) {
        if (!this.contains(node))
            return;
        if (node.prev != null)
            node.prev.next = node.next;
        if (node.next != null)
            node.next.prev = node.prev;
        if (node === this.head)
            this.head = node.next;
        if (node === this.tail)
            this.tail = node.prev;
        this.length -= 1;
    }
    iterator(curNode = this.head) {
        // TODO use yield when we can
        return function () {
            let ret = curNode;
            if (curNode != null)
                curNode = curNode.next;
            return ret;
        };
    }
    find(index, inclusive = false) {
        let cur, next = this.iterator();
        while ((cur = next())) {
            let length = cur.length();
            if (index < length ||
                (inclusive && index === length && (cur.next == null || cur.next.length() !== 0))) {
                return [cur, index];
            }
            index -= length;
        }
        return [null, 0];
    }
    forEach(callback) {
        let cur, next = this.iterator();
        while ((cur = next())) {
            callback(cur);
        }
    }
    forEachAt(index, length, callback) {
        if (length <= 0)
            return;
        let [startNode, offset] = this.find(index);
        let cur, curIndex = index - offset, next = this.iterator(startNode);
        while ((cur = next()) && curIndex < index + length) {
            let curLength = cur.length();
            if (index > curIndex) {
                callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
            }
            else {
                callback(cur, 0, Math.min(curLength, index + length - curIndex));
            }
            curIndex += curLength;
        }
    }
    map(callback) {
        return this.reduce(function (memo, cur) {
            memo.push(callback(cur));
            return memo;
        }, []);
    }
    reduce(callback, memo) {
        let cur, next = this.iterator();
        while ((cur = next())) {
            memo = callback(memo, cur);
        }
        return memo;
    }
}
exports.default = LinkedList;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __webpack_require__(2);
const Registry = __webpack_require__(0);
const OBSERVER_CONFIG = {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
};
const MAX_OPTIMIZE_ITERATIONS = 100;
class ScrollBlot extends container_1.default {
    constructor(node) {
        super(node);
        this.scroll = this;
        this.observer = new MutationObserver((mutations) => {
            this.update(mutations);
        });
        this.observer.observe(this.domNode, OBSERVER_CONFIG);
        this.attach();
    }
    detach() {
        super.detach();
        this.observer.disconnect();
    }
    deleteAt(index, length) {
        this.update();
        if (index === 0 && length === this.length()) {
            this.children.forEach(function (child) {
                child.remove();
            });
        }
        else {
            super.deleteAt(index, length);
        }
    }
    formatAt(index, length, name, value) {
        this.update();
        super.formatAt(index, length, name, value);
    }
    insertAt(index, value, def) {
        this.update();
        super.insertAt(index, value, def);
    }
    optimize(mutations = [], context = {}) {
        super.optimize(context);
        // We must modify mutations directly, cannot make copy and then modify
        let records = [].slice.call(this.observer.takeRecords());
        // Array.push currently seems to be implemented by a non-tail recursive function
        // so we cannot just mutations.push.apply(mutations, this.observer.takeRecords());
        while (records.length > 0)
            mutations.push(records.pop());
        // TODO use WeakMap
        let mark = (blot, markParent = true) => {
            if (blot == null || blot === this)
                return;
            if (blot.domNode.parentNode == null)
                return;
            // @ts-ignore
            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                // @ts-ignore
                blot.domNode[Registry.DATA_KEY].mutations = [];
            }
            if (markParent)
                mark(blot.parent);
        };
        let optimize = function (blot) {
            // Post-order traversal
            if (
            // @ts-ignore
            blot.domNode[Registry.DATA_KEY] == null ||
                // @ts-ignore
                blot.domNode[Registry.DATA_KEY].mutations == null) {
                return;
            }
            if (blot instanceof container_1.default) {
                blot.children.forEach(optimize);
            }
            blot.optimize(context);
        };
        let remaining = mutations;
        for (let i = 0; remaining.length > 0; i += 1) {
            if (i >= MAX_OPTIMIZE_ITERATIONS) {
                throw new Error('[Parchment] Maximum optimize iterations reached');
            }
            remaining.forEach(function (mutation) {
                let blot = Registry.find(mutation.target, true);
                if (blot == null)
                    return;
                if (blot.domNode === mutation.target) {
                    if (mutation.type === 'childList') {
                        mark(Registry.find(mutation.previousSibling, false));
                        [].forEach.call(mutation.addedNodes, function (node) {
                            let child = Registry.find(node, false);
                            mark(child, false);
                            if (child instanceof container_1.default) {
                                child.children.forEach(function (grandChild) {
                                    mark(grandChild, false);
                                });
                            }
                        });
                    }
                    else if (mutation.type === 'attributes') {
                        mark(blot.prev);
                    }
                }
                mark(blot);
            });
            this.children.forEach(optimize);
            remaining = [].slice.call(this.observer.takeRecords());
            records = remaining.slice();
            while (records.length > 0)
                mutations.push(records.pop());
        }
    }
    update(mutations, context = {}) {
        mutations = mutations || this.observer.takeRecords();
        // TODO use WeakMap
        mutations
            .map(function (mutation) {
            let blot = Registry.find(mutation.target, true);
            if (blot == null)
                return null;
            // @ts-ignore
            if (blot.domNode[Registry.DATA_KEY].mutations == null) {
                // @ts-ignore
                blot.domNode[Registry.DATA_KEY].mutations = [mutation];
                return blot;
            }
            else {
                // @ts-ignore
                blot.domNode[Registry.DATA_KEY].mutations.push(mutation);
                return null;
            }
        })
            .forEach((blot) => {
            if (blot == null ||
                blot === this ||
                //@ts-ignore
                blot.domNode[Registry.DATA_KEY] == null)
                return;
            // @ts-ignore
            blot.update(blot.domNode[Registry.DATA_KEY].mutations || [], context);
        });
        // @ts-ignore
        if (this.domNode[Registry.DATA_KEY].mutations != null) {
            // @ts-ignore
            super.update(this.domNode[Registry.DATA_KEY].mutations, context);
        }
        this.optimize(mutations, context);
    }
}
ScrollBlot.blotName = 'scroll';
ScrollBlot.defaultChild = 'block';
ScrollBlot.scope = Registry.Scope.BLOCK_BLOT;
ScrollBlot.tagName = 'DIV';
exports.default = ScrollBlot;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = __webpack_require__(3);
const Registry = __webpack_require__(0);
// Shallow object comparison
function isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;
    // @ts-ignore
    for (let prop in obj1) {
        // @ts-ignore
        if (obj1[prop] !== obj2[prop])
            return false;
    }
    return true;
}
class InlineBlot extends format_1.default {
    static formats(domNode) {
        if (domNode.tagName === InlineBlot.tagName)
            return undefined;
        return super.formats(domNode);
    }
    format(name, value) {
        if (name === this.statics.blotName && !value) {
            this.children.forEach(child => {
                if (!(child instanceof format_1.default)) {
                    child = child.wrap(InlineBlot.blotName, true);
                }
                this.attributes.copy(child);
            });
            this.unwrap();
        }
        else {
            super.format(name, value);
        }
    }
    formatAt(index, length, name, value) {
        if (this.formats()[name] != null || Registry.query(name, Registry.Scope.ATTRIBUTE)) {
            let blot = this.isolate(index, length);
            blot.format(name, value);
        }
        else {
            super.formatAt(index, length, name, value);
        }
    }
    optimize(context) {
        super.optimize(context);
        let formats = this.formats();
        if (Object.keys(formats).length === 0) {
            return this.unwrap(); // unformatted span
        }
        let next = this.next;
        if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
            next.moveChildren(this);
            next.remove();
        }
    }
}
InlineBlot.blotName = 'inline';
InlineBlot.scope = Registry.Scope.INLINE_BLOT;
InlineBlot.tagName = 'SPAN';
exports.default = InlineBlot;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = __webpack_require__(3);
const Registry = __webpack_require__(0);
class BlockBlot extends format_1.default {
    static formats(domNode) {
        let tagName = Registry.query(BlockBlot.blotName).tagName;
        if (domNode.tagName === tagName)
            return undefined;
        return super.formats(domNode);
    }
    format(name, value) {
        if (Registry.query(name, Registry.Scope.BLOCK) == null) {
            return;
        }
        else if (name === this.statics.blotName && !value) {
            this.replaceWith(BlockBlot.blotName);
        }
        else {
            super.format(name, value);
        }
    }
    formatAt(index, length, name, value) {
        if (Registry.query(name, Registry.Scope.BLOCK) != null) {
            this.format(name, value);
        }
        else {
            super.formatAt(index, length, name, value);
        }
    }
    insertAt(index, value, def) {
        if (def == null || Registry.query(value, Registry.Scope.INLINE) != null) {
            // Insert text or inline
            super.insertAt(index, value, def);
        }
        else {
            let after = this.split(index);
            let blot = Registry.create(value, def);
            after.parent.insertBefore(blot, after);
        }
    }
    update(mutations, context) {
        if (navigator.userAgent.match(/Trident/)) {
            this.build();
        }
        else {
            super.update(mutations, context);
        }
    }
}
BlockBlot.blotName = 'block';
BlockBlot.scope = Registry.Scope.BLOCK_BLOT;
BlockBlot.tagName = 'P';
exports.default = BlockBlot;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = __webpack_require__(4);
class EmbedBlot extends leaf_1.default {
    static formats(domNode) {
        return undefined;
    }
    format(name, value) {
        // super.formatAt wraps, which is what we want in general,
        // but this allows subclasses to overwrite for formats
        // that just apply to particular embeds
        super.formatAt(0, this.length(), name, value);
    }
    formatAt(index, length, name, value) {
        if (index === 0 && length === this.length()) {
            this.format(name, value);
        }
        else {
            super.formatAt(index, length, name, value);
        }
    }
    formats() {
        return this.statics.formats(this.domNode);
    }
}
exports.default = EmbedBlot;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const leaf_1 = __webpack_require__(4);
const Registry = __webpack_require__(0);
class TextBlot extends leaf_1.default {
    constructor(node) {
        super(node);
        this.text = this.statics.value(this.domNode);
    }
    static create(value) {
        return document.createTextNode(value);
    }
    static value(domNode) {
        let text = domNode.data;
        // @ts-ignore
        if (text['normalize'])
            text = text['normalize']();
        return text;
    }
    deleteAt(index, length) {
        this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
    }
    index(node, offset) {
        if (this.domNode === node) {
            return offset;
        }
        return -1;
    }
    insertAt(index, value, def) {
        if (def == null) {
            this.text = this.text.slice(0, index) + value + this.text.slice(index);
            this.domNode.data = this.text;
        }
        else {
            super.insertAt(index, value, def);
        }
    }
    length() {
        return this.text.length;
    }
    optimize(context) {
        super.optimize(context);
        this.text = this.statics.value(this.domNode);
        if (this.text.length === 0) {
            this.remove();
        }
        else if (this.next instanceof TextBlot && this.next.prev === this) {
            this.insertAt(this.length(), this.next.value());
            this.next.remove();
        }
    }
    position(index, inclusive = false) {
        return [this.domNode, index];
    }
    split(index, force = false) {
        if (!force) {
            if (index === 0)
                return this;
            if (index === this.length())
                return this.next;
        }
        let after = Registry.create(this.domNode.splitText(index));
        this.parent.insertBefore(after, this.next);
        this.text = this.statics.value(this.domNode);
        return after;
    }
    update(mutations, context) {
        if (mutations.some(mutation => {
            return mutation.type === 'characterData' && mutation.target === this.domNode;
        })) {
            this.text = this.statics.value(this.domNode);
        }
    }
    value() {
        return this.text;
    }
}
TextBlot.blotName = 'text';
TextBlot.scope = Registry.Scope.INLINE_BLOT;
exports.default = TextBlot;


/***/ })
/******/ ]);
});
//# sourceMappingURL=parchment.js.map