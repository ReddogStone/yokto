'use strict';

const end = (code, content, headers) => function(response) {
	response.statusCode = code;
	if (headers) {
		for (let key in headers) {
			let value = headers[key];
			response.setHeader(key, value);
		}
	}
	response.end(content || '');
};

exports.badRequest = () => end(400, 'Bad request');
exports.deny = () => end(403, 'Access denied');
exports.redirect = url => end(303, '', { 'Location': url });

exports.notFound = function(content, headers) {
	content = content || '404 File not found';
	headers = headers || { "Content-Type": "text/plain" };
	return end(404, content, headers);
}

exports.end = end;
