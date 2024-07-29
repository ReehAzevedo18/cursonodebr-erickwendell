const {config} = require('dotenv')
const {join} = require('path')
const {ok} = require('assert')
var Parse = require('parse/node')

const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env == "dev", "a env é inválida, ou DEV ou PROD")

const configPath = join(__dirname, './config', `.env.${env}`)
config({path: configPath})

Parse.initialize("UFIlgYmVlhP4ntdqe08DQoMV84Huhs0gMZZyhTxR", "r5R1YWU6OhftU3SCoOFYnS83GRvhbWgpSKsatVJK")
Parse.serverURL = 'https://parseapi.back4app.com/classes/cursonodebr-erickwendell'


const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const HeroiSchema = require('./src/db/strategies/mongodb/schemas/heroisSchema')
const MongoDB = require('./src/db/strategies/mongodb/mongodb')
const HeroRoutes = require('./src/routes/heroRoutes')
const AuthRoutes = require('./src/routes/authRoutes')

const app = new Hapi.Server({
    port: process.env.PORT
})


//npm i hapi-auth-jwt2
const HapiJwt = require('hapi-auth-jwt2')

const Postgress = require('./src/db/strategies/postgres/postgres')
const UsuarioSchema = require('./src/db/strategies/postgres/schemas/usuarioSchema')

// Swagger
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

//Auth
const JWT_SECRET = process.env.JWT_KEY;

const { version } = require('joi')
const { error } = require('console')

//Pego o nome de cada metodo e chamo aqui
function mapRoutes(instance, methods){
    return methods.map(method => instance[method]())
}

async function main(){
    
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))
    //Conexão com Postgress
    const connectionPotsgress = await Postgress.connect()
    const usuarioSchema = await Postgress.defineModel(connectionPotsgress, UsuarioSchema)
    const contextPostgres = new Context(new Postgress(connectionPotsgress, usuarioSchema))
    const swaggerOptions = {
        info: {
            title: 'API Herois - Curso Wendel',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions

        }
    ])
    //Montando uma strategia para qualquer requisição bater na validação do jwt
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) =>{
            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase(),
                id: dado.id
            })
            if(!result){
                return {
                    isValid: false
                }
            }
           //verifica no banco se o user tá ativo
           return {
            isValid: true //caso não valide é falso
        }
        }
    })
    app.auth.default('jwt')
    //Não é necessário preencher cada método usando dessa forma
    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)

    return app
}
module.exports = main()