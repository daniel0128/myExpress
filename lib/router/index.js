'use strict';

const Route = require('./route');
const Layer = require('./layer');
const methods = require('methods');
const parsUrl = require('parseurl');
const flatten = require('array-flatten');

const setPrototypeOf = Object.setPrototypeOf;
const slice = Array.prototype.slice;

const proto = module.exports = function (options) {
	function router(req, res, next) {
		router.handle(req, res, next);
	}
	setPrototypeOf(router, proto);

	router.params = {};

	router.stack = [];
	return router;
};

// lesson 5
proto.param = function param (name, fn) {
	(this.params[name] = this.params[name] || []).push(fn);
	// visitor pattern?
};

proto.handle = function handle (req, res, out) {
	const self = this;

	const stack = this.stack;
	let idx = 0;
	const finalHandler = function (req, res) {
		console.log('reach final handler.');
	};

	next();

	function next (err) {
		const layerError = err;
		if (err === 'router') {
			setImmediate(finalHandler, null);
			return;
		}
		if(idx >= stack.length) {
			return setImmediate(finalHandler, null);
		}
		const path = getPathname(req);

		let layer, match, route;

		while (match !== true && idx < stack.length) {
			layer = stack[idx++];
			match = matchLayer(layer, path);
			route = layer.route;
			if (match !== true) continue;

			// if a layer has a property route it's a route middleware
			if (!route) continue;
			if (layerError) {
				match = false;
				continue;
			}
			const method = req.method;
			const hasMethod = route._handle_method(method);
			if (!hasMethod) {
				match = false;
				// lesson 4
				continue;
			}
		}
		if (match !== true) {
			return finalHandler(layerError);
		}
		req.params = layer.params;
		// if there are params, process them first, visit params array and run relevant functions
		// so app.param() would always run before app.get() etc.
		self.process_params(layer, req, res, function (err) {
			if (err) {
				return next(layerError || err);
			}
			if (route) {
				return layer.handle_request(req, res, next)
			}
			if (layerError) {
				layer.handle_error(layerError, req, res, next);
			} else {
				layer.handle_request(req, res, next);
			}
		});

		// return layer.handle_request(req, res, next);
	}
};

proto.use = function use (path, fn) {
	let callbacks = flatten (slice.call(arguments, 1));
	for (let i = 0; i<callbacks.length; i++) {
		let handle = callbacks[i];

		let layer = new Layer(path, {
			sensitive: this.caseSensitive,
			strict: false,
			end: false
		}, handle);

		layer.route = undefined;
		this.stack.push(layer);
	}

	return this;
};

proto.process_params = function processParams (layer, req, res, done) {
	const params = this.params;
	const keys = layer.keys;

	if (!keys || keys.length === 0) {
		return done();
	}

	let i = 0;
	let name, paramIndex = 0, key, paramVal, paramCallbacks;

	function param() {
		if (i >= keys.length) {
			return done();
		}
		paramIndex = 0;
		key = keys[i++];
		// console.log(key);

		// if there are keys i.e. params, loop the params array and call function
		name = key.name;
		paramVal = req.params[name];
		paramCallbacks = params[name];
		// console.log(params);
		// console.log(name);
		// console.log(paramCallbacks && paramCallbacks.toString());
		if (paramVal === undefined || !paramCallbacks) {
			return param();
		}
		paramCallback();
	}

	function paramCallback () {
		const fn = paramCallbacks[paramIndex++];
		if (!fn) return param();
		try {
			fn(req, res, paramCallback, paramVal, key.name);
		} catch (e) {
			throw e;
		}
	}

	param();
};

proto.route = function route (path) {
	const route = new Route(path);
	const layer = new Layer(path, {}, route.dispatch.bind(route));
	layer.route = route;
	this.stack.push(layer);
	return route;
};

methods.forEach(function (method) {
	proto[method] = function (path) {
		const route = this.route(path);
		route[method].apply(route, slice.call(arguments, 1));
		return this;
	}
});

function getPathname (req) {
	try {
		return parsUrl(req).pathname;
	} catch (err) {
		return undefined;
	}
}

function matchLayer (layer, path) {
	try {
		return layer.match(path);
	} catch (err) {
		return err;
	}
}
