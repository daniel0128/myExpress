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
	this.regexp = pathRegexp(path, this.keys = [], opts);
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
	console.log(this);
	console.log(fn);
	try {
		fn(req, res, next);
	} catch (err) {
		throw err;
	}
};

Layer.prototype.match = function match (path) {
	if (path != null) {
		if (this.regexp.fast_slash) {
			return true;
		}
		if (this.regexp.fast_star) {
			return true;
		}
		const match = this.regexp.exec(path);
		return Boolean(match);
	}
};
