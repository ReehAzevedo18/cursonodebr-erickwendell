const assert = require("assert");
const api = require("../api");
const Context = require("./../src/db/strategies/base/contextStrategy");
const Postgress = require("./../src/db/strategies/postgres/postgres");
const UsuarioSchema = require("./../src/db/strategies/postgres/schemas/usuarioSchema");
let app = {};

const USER = {
  username: "xuxinha",
  password: "123",
};

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$4k9qhkAS.KhRun8nxAxUO.rjy2QLU6LouAsaFodQSJ39j8orUwNhu'
}
describe("Auth test suite", function () {
  this.beforeAll(async () => {
    app = await api;
    //Inicia a conexao
    const connectionPotsgress = await Postgress.connect();
    const model = await Postgress.defineModel(
      connectionPotsgress,
      UsuarioSchema
    );
    const postgres = new Context(new Postgress(connectionPotsgress, model))
    await postgres.update(null, USER_DB, true)
  });

  it("Deve obter um token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: USER
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });

  it('Deve retornar não autorizado ao tentar obter um login errado', async () => {
    const result = await app.inject({
        method: "POST",
        url: "/login",
        payload: {
            username: 'erick',
            password: '111'
        }
      });
      const statusCode = result.statusCode
      const dados = JSON.parse(result.payload)

      assert.deepEqual(statusCode, 401)
      assert.deepEqual(dados.error, "Unauthorized")
  })
});
