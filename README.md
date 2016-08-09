# yokto
An HTTP library so minimal, it is barely visible!

# example

``` js
const http  = require('http')

const yokto = require('yokto');
const stack = yokto.stack;
const finalizer = yokto.finalizer;
const route = yokto.route;

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

## License

MIT
