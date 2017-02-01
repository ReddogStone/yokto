'use strict';

const assert = require('assert');

/**
 *
 * Each layer is a function: request => Promise<Finalizer>,
 * where Finalizer is a function: response => void
 * 
 * errorHandler is a function: (request, error) => Promise<Finalizer>
 *
 */
module.exports = function(layers, errorHandler) {
	assert(Array.isArray(layers), `Parameter "layers" needs to be an array, but was "${typeof layers}"`);

	const fallback = error => Promise.resolve(function(response) {
		response.writeHead(error ? 500 : 404, { 'Content-Type': 'text/plain' });
		response.end(error ? error.stack : '404 Not found');
	});

	function handleError(request, error) {
		if (!errorHandler) {
			return fallback(error);
		}
		return Promise.resolve()
			.then(() => errorHandler(request, error)).then(finalizer => finalizer || fallback(error))
			.catch(function(error) {
				console.error('Error handler threw an exception:', error.stack);
				return fallback(error);
			});
	}

	return function(request, response) {
		let process = layers.reduceRight(
			(memo, current) =>
				request =>
					Promise.resolve().then(() => current(request)).then(finalizer => finalizer || memo(request)),
			handleError
		);
		process(request)
			.catch(error => handleError(request, error))
			.then(function(finalizer) {
				assert(finalizer, 'There should definitely be a finalizer here!');
				finalizer(response);
			});
	};
};
