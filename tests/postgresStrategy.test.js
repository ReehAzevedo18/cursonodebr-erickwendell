const assert = require('assert')
const Postgres = require('./../src/db/strategies/postgres/postgres')
const Context = require('./../src/db/strategies/base/contextStrategy')
const HeroiSchema = require('./../src/db/strategies/postgres/schemas/heroiSchema')


const MOCK_HEROI_CADASTRAR = {nome: 'Gavião Negro', poder: 'flexas'}
const MOCK_HEROI_ATUALIZAR = {nome: 'Batman', poder: 'Dinheiro'}

let context = {}
describe('Postgres Strategy', function(){
    this.timeout(Infinity)
    this.beforeAll(async function() {
       const connection = await Postgres.connect()
       const model = await Postgres.defineModel(connection, HeroiSchema)
       context = new Context(new Postgres(connection, model))
       await context.delete()
       await context.create(MOCK_HEROI_ATUALIZAR)
    })
    it('PostgresSQL Connection', async function(){
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('cadastrar', async function(){
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it("listar", async function () {
        const [{ nome, poder }] = await context.read({
          nome: MOCK_HEROI_CADASTRAR.nome,
        });
        /**
         * Pegar a primeira posição
         * const posicaoZero = result[0]
         * const [posicao1, posicao2] = ['esse é o 1, esse é o 2']
         */
        // console.log('result', result.dataValues)
        const result = { nome, poder };
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
      });
      it("atualizar", async function () {
        const [itemAtualizar] = await context.read({
          nome: MOCK_HEROI_ATUALIZAR.nome,
        });
        const novoItem = {
          /** Quando eu adiciono os "..." antes do objeto, eu estou desestruturando aquele objeto
           * e consigo trabalhar com valores que estão dentro dele.*
           */
          ...MOCK_HEROI_ATUALIZAR,
          nome: "Mulher Maravilha",
        };
        const result = await context.update(itemAtualizar.id, novoItem);
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id });
        assert.ok(result, 1);
        assert.deepEqual(itemAtualizado.nome, novoItem.nome);
      });
    
      it("remover por id", async function () {
        const [item] = await context.read({});
        const result = await context.delete(item.id);
        assert.ok(result, 1);
      });
})