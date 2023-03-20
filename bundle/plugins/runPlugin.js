class RunPlugin {
    constructor() {

    }
    apply(compiler) {
        compiler.hooks.run.tap('runPlugin', () => {
            console.log('runPlugin')
        })
    }
}

module.exports = RunPlugin