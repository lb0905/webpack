const { SyncHook } = require('tapable');
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const types = require('@babel/types');

function toUnixPath(filePath) {
    return filePath.replace(/\\/g, path.posix.sep)
}
class Compile {
    constructor(option) {
        this.option = option;
        this.modules = [];
        this.chunks = [];
        this.entrys = [];
        this.assets = {};
        this.files = [];
        this.baseDir = toUnixPath(this.option.context);
        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook(),
        }
    }
    run() {
        this.hooks.run.call();
        let entry = Object.create(null);
        if (typeof this.option.entry === 'string') {
            entry.main = this.option.entry;
        } else {
            entry = this.option.entry;
        }
        for (const entryName in entry) {
            const entryFilePath = toUnixPath(path.join(this.option.context, entry[entryName]));
            let entryModule = this.builtModule(entryName, entryFilePath);
            //    this.modules.push(entryModule);
            let chunk = { name: entryName, entryModule, modules: this.modules.filter(m => m.name === entryName) };
            this.chunks.push(chunk);
            this.entrys.push(chunk);
        }
        for (let index = 0; index < this.chunks.length; index++) {
            const chunk = this.chunks[index];
            const filename = this.option.output.filename.replace('[name]', chunk.name);
            this.assets[filename] = getSource(chunk);
        }
        this.files = Object.keys(this.assets);
        for (const file in this.assets) {
            let targetPath = path.join(this.option.output.path, file);
            fs.writeFileSync(targetPath, this.assets[file])
        }
        this.hooks.done.call();
    }
    builtModule = (entryName, modulePath) => {
        const _this = this;
        const moduleId = './' + path.posix.relative(toUnixPath(this.option.context), modulePath);
        const module = { moduleId, dependence: [], name: entryName };
        let originSourceCode = fs.readFileSync(modulePath, 'utf-8');
        const rules = this.option.module.rules || [];
        const loaders = [];
        for (const rule of rules) {
            if (rule.test.test(modulePath)) {
                loaders.push(rule.use)
            }
        }
        for (let i = loaders.length - 1; i >= 0; i--) {
            const loader = loaders[i];
            originSourceCode = require(loader)(originSourceCode);
        }
        const astTree = parse(originSourceCode);
        traverse(astTree, {
            CallExpression({ node }) {
                if (node.callee.name === 'require') {
                    const moduleName = node.arguments[0].value;
                    let depModulePath;
                    const dirname = path.posix.dirname(modulePath);
                    if (path.isAbsolute(moduleName)) {
                        depModulePath = moduleName;
                    } else {
                        depModulePath = path.posix.join(dirname, moduleName);
                    }
                    module.dependence.push(depModulePath);
                    const depModuleId = './' + path.posix.relative(toUnixPath(_this.option.context), depModulePath);
                    node.arguments = [types.stringLiteral(depModuleId)];
                }
            }
        });
        const { code } = generator(astTree);
        module._source = code;
        module.dependence.forEach(dep => {
            const dependenceMoudle = this.builtModule(entryName, dep);
            this.modules.push(dependenceMoudle)
        })
        return module
    }
}

function getSource(chunk) {
    return `(() => {
        var modules = {
            ${chunk.modules.map(module => {
        return `"${module.moduleId}": (module, exports, require) => {
                    ${module._source}
                }`
    }).join(',')}
        };
        var cache = {};
        function require(moduleId) {
            var cachedModule = cache[moduleId];
            if (cachedModule !== undefined) {
              return cachedModule.exports;
            }
            var module = cache[moduleId] = {
              exports: {}
            };
            modules[moduleId](module, module.exports, require);
            return module.exports;
        }
        (() => {
            ${chunk.entryModule._source}
          })();
    })()`
}
module.exports = Compile