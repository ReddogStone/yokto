# yokto
An HTTP library so minimal, it is barely visible!

# example

``` js
const http  = require('http')

const {stack, route, finalizer} = require('yokto');

http.createServer(stack([
  route.get('/ping', request => finalizer.end(200, 'pong'))
], function(request, error) {
  // this is an optional error handler
  if (error) {
    return finalizer.end(500, error.stack);
  }
  return finalizer.notFound();
})).listen(8000);
```

Example with ```async/await```:
``` js
const http  = require('http')
const {stack, route, finalizer} = require('yokto');
const getRawBody = require('raw-body');

http.createServer(stack([
	route.post('/product', async function(request) {
		const body = await getRawBody(request, 'utf8');

		if (body.message === 'Hello') {
			return finalizer.end(200, JSON.stringify({ ok: true }));
		}

		return finalizer.end(500, 'Error');
	})
], function(request, error) {
  // this is an optional error handler
  if (error) {
    return finalizer.end(500, error.stack);
  }
  return finalizer.notFound();
})).listen(8000);
```


## License

MIT
