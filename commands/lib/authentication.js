const installOptions = (yargs) => {
    yargs.option('gitlab-key', {
        describe: 'Gitlab key',
        type: 'string',
        alias: 'u'
    })
}

const handleOptions = (argv, options) => {
    const { gitlabKey } = argv

    options.gitlabKey = gitlabKey
}

module.exports = {
    installOptions,
    handleOptions
}
