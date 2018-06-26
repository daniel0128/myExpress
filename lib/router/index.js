'use strict';

const Route = require('./route');
const Layer = require('./layer');
const methods = require('methods');
const parsUrl = require('parseurl');

const setPrototypeOf = Object.setPrototypeOf;
const slice = Array.prototype.slice;

const proto = module.exports = function (options) {
	function router(req, res, next) {
		router.handle(req, res, next);
	}
	setPrototypeOf(router, proto);
	router.stack = [];
	return router;
};

proto.handle = function handle (req, res, out) {
	const stack = this.stack;
	let idx = 0;
	const finalHandler = function (req, res, next) {
		console.log('This is the final handler.');
	};

	next();

	function next () {
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
			if (!route) continue;
			const method = req.method;
			const hasMethod = route._handle_method(method);
			if (!hasMethod) continue;
		}
		if (match !== true) {
			return finalHandler();
		}
		return layer.handle_request(req, res, next);
	}
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
