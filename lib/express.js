const http = require('http');
const mixin = require('merge-descriptors');
const methods = require('methods');
const Layer = require('./router/layer');
const Route = require('./router/route');
const Router = require('./router/index');

const slice = Array.prototype.slice;

module.exports = function createServer() {
	const app = function (req, res) {
		// res.end('Response From Server\n'); lesson 1
		app.handle(req, res);
	};

	mixin(app, proto, false);
	app.init();
	return app;
};

const proto = Object.create(null);

proto.listen = function (port) {
	const server = http.createServer(this);
	console.log('Server is running...');
	return server.listen.apply(server, arguments);
};

proto.init = function () {

};

proto.lazyrouter = function lazyrouter () {
	if (!this._router) {
		this._router = new Router({})
	}
};

proto.handle = function(req, res) {
	const router = this._router;
	router.handle(req, res);
	// lesson 3
	// this.route.dispatch.apply(this.route, slice.call(arguments));

	// lesson 2
	// for (let i = 0; i<this.handles.length; i++) {
	// 	const layer = this.handles[i];
	// 	layer.handle_request(req, res);
	// }
};

methods.forEach(function (method) {
	proto[method] = function (path) {
		this.lazyrouter();
		const route = this._router.route(path);
		route[method].apply(route, slice.call(arguments, 1));

		// lesson 3
		// this.route[method].apply(this.route, slice.call(arguments));
		// lesson 2
		// const layer = new Layer(method, fn);
		// this.handles.push(layer);
	}
});
