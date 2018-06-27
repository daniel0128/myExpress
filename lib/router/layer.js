'use strict';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const pathRegexp = require('path-to-regexp');

module.exports = Layer;

// before lesson 4
// function Layer (method, fn) {
// 	this.method = method;
// 	this.handle = fn;
// }

function Layer (path, options, fn) {
	const opts = options || {};
	this.handle = fn;
	this.name = fn.name || '<anonymous>';

	this.params = undefined;
	this.path = undefined;

	this.regexp = pathRegexp(path, this.keys = [], opts);
	// console.log(this.regexp);
	// console.log(this.keys);
	this.regexp.fast_star = path === '*';
	this.regexp.fast_slash = path === '/';
}

// before lesson 4
// Layer.prototype.handle_method = function (req) {
// 	return this.method.toLowerCase() === req.method.toLowerCase();
// };

Layer.prototype.handle_request = function handleRequest (req, res, next) {
	// not arrow function here, see:
	// https://stackoverflow.com/questions/34361379/arrow-function-vs-function-declaration-expressions-are-they-equivalent-exch
	// console.log(this.handle_method);

	// before lesson 4
	// if (!this.handle_method(req)) return;
	const fn = this.handle;
	// console.log(this);
	console.log('fn', fn.toString());

	// lesson 6
	if (fn.length > 3) {
		return next();
	}
	try {
		fn(req, res, next);
	} catch (err) {
		next(err); // lesson 6
		// throw err; // before lesson 6
	}
};

Layer.prototype.handle_error = function handleError (err, req, res, next) {
	const fn = this.handle;
	if (fn.length !== 4) {
		return next(err);
	}

	try {
		fn (err, req, res, next);
	} catch (err) {
		next(err);
	}
};

/**
 * Check if this route matches path, if so,
 * populate `.params`
 * @param  {String} path
 * @return {Boolean}
 */
Layer.prototype.match = function match (path) {
	// lesson 3
	// if (path != null) {
	// 	if (this.regexp.fast_slash) {
	// 		return true;
	// 	}
	// 	if (this.regexp.fast_star) {
	// 		return true;
	// 	}
	// 	const match = this.regexp.exec(path);
	// 	return Boolean(match);
	// }

	let match;
	if (path != null) {
		if (this.regexp.fast_slash) {
			this.params = {};
			this.path = '';
			return true;
		}
		match = this.regexp.exec(path);
	}
	if (!match) {
		this.params = undefined;
		this.path = undefined;
		return false;
	}

	this.params = {};
	this.path = match[0];

	const keys = this.keys;
	const params = this.params;
	for (let i = 1; i < match.length; i++) {
		const key = keys[i - 1];
		const prop = key.name;
		const val = match[i];
		if (val !== undefined || hasOwnProperty.call(params, prop)) {
			params[prop] = val;
		}
	}
	return true;
};
