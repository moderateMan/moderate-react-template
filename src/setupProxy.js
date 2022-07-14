const proxy = require("http-proxy-middleware");
module.exports = function(app) {
    app.use(
        proxy("/proxy", {
            target: "http://localhost:3060",
            changeOrigin: true,
            pathRewrite: { '^/proxy': '' }
        })
    );
};