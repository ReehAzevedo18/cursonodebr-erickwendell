const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const HeroiSchema = require('./src/db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./src/db/strategies/mongodb/mongodb')
const app = new Hapi.Server({
    port: 5000
})

async function main(){
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))
    app.route([
        {
            path: '/herois',
            method: 'GET',
            handler: (request, head) => {
                return context.read()
            }
        }
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)
}

main()