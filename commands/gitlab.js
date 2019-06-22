exports.yargs = {
    command: 'gitlab <command>',
    describe: 'Gitlab utility',
    aliases: ['gh'],

    builder: (yargs) => {
        yargs.command(require('./sub/projects').yargs)
    }
}
