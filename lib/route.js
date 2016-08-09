'use strict';

const url = require('url');

const wrapIf = (condition, func) => request => Promise.resolve(condition(request) && func(request));

module.exports = {
	url: function(pathname, func) {
		return wrapIf(request => url.parse(request.url).pathname === pathname, func);
	},
	regex: function(pathRegex, func) {
		return wrapIf(request => pathRegex.test(url.parse(request.url).pathname), func);
	},
	get: function(pathname, func) {
		return wrapIf(request => (request.method === 'GET') && (url.parse(request.url).pathname === pathname), func);
	},
	post: function(pathname, func) {
		return wrapIf(request => (request.method === 'POST') && (url.parse(request.url).pathname === pathname), func);
	}
};