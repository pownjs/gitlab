exports.yargs = {
    command: 'projects <login>',
    describe: 'List projects',

    builder: (yargs) => {
        require('../../lib/concurrency').installOptions(yargs)
        require('../../lib/authentication').installOptions(yargs)

        yargs.options('owned', {
            description: 'Limit by projects explicitly owned by the user',
            type: 'boolean',
            default: true
        })
    },

    handler: async(argv) => {
        const { login, owned } = argv

        const Gitlab = require('../../../lib/gitlab')

        const options = {}

        require('../../lib/concurrency').handleOptions(argv, options)
        require('../../lib/authentication').handleOptions(argv, options)

        const gitlab = new Gitlab(options)

        for await (let item of gitlab.projects(login, { owned })) {
            console.table(item)
        }
    }
}
