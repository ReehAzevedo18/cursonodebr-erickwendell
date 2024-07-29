const assert = require("assert");
const api = require("./../api");
let app = {};

const Postgres = require('./../src/db/strategies/postgres/postgres')
const Context = require('./../src/db/strategies/base/contextStrategy')
const HeroiSchema = require('./../src/db/strategies/postgres/schemas/heroiSchema')
let context = {};

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGluaGEiLCJpZCI6MSwiaWF0IjoxNzIwMjEwNjY5fQ.P3WpnvWU3jYRbaE4TI96a3m0LIyIH0wr_7MVDrJcyok";

const headers = {
  Authorization: TOKEN,
};
const MOCK_HEROI_CADASTRAR = {
  nome: "Chapolin Colorado",
  poder: "Marreta Biônica",
};
const MOCK_HEROI_INICIAL = {
  nome: "Super Choque",
  poder: "Choque",
};
let MOCK_ID = "";
describe("Suite de testes da API Heroes", function () {
  this.beforeAll(async () => {
    app = await api
    // const result = await app.inject({
    //     method: 'POST',
    //     headers,
    //     url: '/herois',
    //     payload: JSON.stringify(MOCK_HEROI_INICIAL)
    // })
    // const dados = JSON.parse(result.payload)
    // MOCK_ID = dados._id
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, HeroiSchema);
    context = new Context(new Postgres(connection, model));
    const result = await context.create(MOCK_HEROI_CADASTRAR);
    const dados = result
    MOCK_ID = dados.id
  });

  it("Listar /herois", async () => {
    const result = await context.read({
        nome: MOCK_HEROI_CADASTRAR.nome,
    })
    const dados = result;
    
    // //Valida se o payload é um Array
    assert.ok(Array.isArray(dados));
  });

  it("Listar /herois - deve retornar apenas 3 registros", async () => {
    const size_limit = 3;
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/herois?skip=0&limit=${size_limit}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === size_limit);
  });

  it("Listar /herois - deve filtrar 1 registro", async () => {
    const NAME = MOCK_HEROI_INICIAL.nome;
    const result = await app.inject({
      method: "GET",
      headers,
      url: `/herois?skip=0&limit=1000&nome=${NAME}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.deepEqual(dados[0].nome, NAME);
  });

  it("Cadastrar POST /herois", async () => {
    const result = await app.inject({
      method: "POST",
      headers,
      url: "/herois",
      payload: JSON.stringify(MOCK_HEROI_CADASTRAR),
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Heroi cadastrado com sucesso");
  });

  it("Atualizar PATCH /herois/:id", async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: "Choquissimo",
    };
    const result = await app.inject({
      method: "PATCH",
      headers,
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi Atualizado com sucesso!");
  });

  it("Remover DELETE /herois/:id", async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: "DELETE",
      headers,
      url: `/herois/${_id}`,
    });
    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi Removido com sucesso!");
  });

  // it('NÃO deve Remover DELETE /herois/:id', async () => {
  //     const _id = '5ab32ass4fd'
  //     const result = await app.inject({
  //         method: 'DELETE',
  //         url: `/herois/${_id}`
  //     })
  //     const statusCode = result.statusCode
  //     const dados = JSON.parse(result.payload)
  //     const expected = {
  //         statusCode: 412,
  //         error: 'PreconditionFailed',
  //         message: 'ID não encontrado no banco'
  //     }
  //     assert.ok(statusCode === 412)
  //     assert.deepEqual(dados.message, 'Heroi Removido com sucesso!')
  // })
});
