Advanced static content resolver.
If you have code in es6 and you don't want to babelify it for modern browsers you could use this middleware.

'Example'
const resolver = createResolver({
    oldPath: express.static(path.join(__dirname, './static/old_static')),
    modernPath: express.static(path.join(__dirname, './static/new_static'))
});
app.use('/public', resolver);

So, the express app returns the static content from the oldPath in case of old browser and from the modernPath in case of modern browser