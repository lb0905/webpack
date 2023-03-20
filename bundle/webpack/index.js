const Compile = require('./compile')

function webpack(option) {
    const argv = process.argv.slice(2);
    let shellOption = argv.reduce((shellOption, item) => {
        const [key, value] = item.split('=');
        shellOption[key.slice(2)] = value;
        return shellOption
    }, {});
    // 1 初始化参数 从配置文件和shell语句中合并参数
    const finalOption = Object.assign(option, shellOption);
    // 2开始编译 用初始参数初始化compiler对象 加载所有的插件 执行comliler.run方法开始编译
    const compiler = new Compile(finalOption);
    //  
    const plugins = finalOption.plugins || [];
    plugins.forEach(plugin => {
        plugin.apply(compiler)
    });
    return compiler
}
module.exports = webpack