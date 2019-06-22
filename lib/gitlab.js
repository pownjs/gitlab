const querystring = require('querystring')
const { Scheduler } = require('@pown/request/lib/scheduler')

class Gitlab {
    constructor(options) {
        this.scheduler = new Scheduler({ maxConcurrent: 100, ...options })

        this.headers = {
            'user-agent': 'Pown'
        }

        const { gitlabKey, gitlabToken } = options || {}

        if (gitlabKey || gitlabToken) {
            this.headers['authorization'] = `Basic ${Buffer.from(gitlabKey || gitlabToken).toString('base64')}`
        }
    }

    throw (errors) {
        for (let error of errors) {
            const { message } = error

            throw new Error(`${message}`)
        }
    }

    async fetch(uri) {
        return await this.scheduler.fetch(uri, this.headers)
    }

    async * paginate(uri) {
        do {
            const { responseCode, responseHeaders, responseBody } = await this.fetch(uri)

            const result = JSON.parse(responseBody)

            const { errors } = result

            if (errors) {
                this.throw(errors)
            }

            if (responseCode !== 200) {
                this.throw([JSON.parse(responseBody)])
            }

            yield result

            const { link } = responseHeaders

            if (link) {
                const match = link.match(/<([^>]+?)>;\s*rel="next"/)

                if (match) {
                    uri = match[1]
                }
                else {
                    uri = null
                }
            }
            else {
                uri = null
            }
        } while (uri)
    }

    async * projects(username, options) {
        const search = querystring.stringify({ ...options })

        for await (let items of this.paginate(`https://gitlab.com/api/v4/users/${encodeURIComponent(username)}/projects?${search}`)) {
            for (let item of items) {
                yield item
            }
        }
    }
}

module.exports = Gitlab
