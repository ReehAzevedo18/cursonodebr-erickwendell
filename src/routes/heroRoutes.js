const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroRoutes extends BaseRoute{
    constructor(db){
        super() //Para chamar a classe pai BaseRoute
        this.db = db
    }

    list(){
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Listar Herois',
                notes: 'Paginação de resultados e filtragem por nome.',
                validate: {
                    //payload -> header | headers -> header | params -> na URL :id | query -> ?skip=10&limit=100
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers,
                }
            },
            handler: (request, headers) => {
                try {
                    const {skip, limit, nome} = request.query
                    const query = {
                        nome: {$regex: `.*${nome}*.`}
                    }
                    return this.db.read(nome ? query: {}, skip, limit)
                } catch (error) {
                    console.log('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }

    create(){
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastrar Herois',
                notes: 'Cadastrar Herois por nome e poder.',
                validate: {
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {nome, poder} = request.payload
                    const result = await this.db.create({nome, poder})
                    return {
                        message: 'Heroi cadastrado com sucesso', 
                        _id: result._id
                    }
                } catch (error) {
                    console.log('Deu ruim', error)
                    return Boom.internal()
                }
            }
        }
    }

    update(){
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualizar Heroi',
                notes: 'Atualização do heroi por id, pode atualizar qualquer campo.',
                validate:{
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            }, 
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const {payload} = request
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    return {
                        message:  'Heroi Atualizado com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete(){
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remover Heroi',
                notes: 'Remoção do heroi por id.',
                validate: {
                    failAction,
                    headers,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    const result = await this.db.delete(id)
                    // if(result.nModified !== 1){
                    //     return Boom.preconditionFailed("ID não encontrado no banco")
                    // }
                    return {
                        message: 'Heroi Removido com sucesso!'
                    }
                } catch (error) {
                    console.error('DEU RUIM', error)
                    return Boom.internal()
                    
                }

            }
        }
    }
}

module.exports = HeroRoutes