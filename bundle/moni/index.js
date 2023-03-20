(
    () => {
        var __webpack_modules__ = {
            './src/title.js': (module) => {
                module.exports = 'titleTxt'
            }
        };
        var cache = {};
        function require(moduleId) {
            var cachedModule = cache[moduleId];
            if (cachedModule !== undefined) {
                return cachedModule.exports;
            }

            var module = cache[moduleId] = {
                exports: {}
            }
            __webpack_modules__[moduleId](module, module.exports, require);
            return module.exports
        }

        (() => {
            const title = require('./src/title.js');
            console.log(title)
        })()
    }
)()

