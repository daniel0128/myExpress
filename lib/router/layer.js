'use strict';
const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = Layer;

function Layer (method, fn) {
	this.method = method;
	this.handle = fn;
}

Layer.prototype.handle_method = function (req) {
	return this.method.toLowerCase() === req.method.toLowerCase();
};

Layer.prototype.handle_request = function (req, res, next) {
	// not arrow function here, see:
	// https://stackoverflow.com/questions/34361379/arrow-function-vs-function-declaration-expressions-are-they-equivalent-exch
	// console.log(this.handle_method);
	if (!this.handle_method(req)) return;
	const fn = this.handle;
	try {
		fn(req, res, next);
	} catch (err) {
		throw err;
	}
};
