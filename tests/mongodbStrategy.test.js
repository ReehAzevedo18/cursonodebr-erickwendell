const assert = require("assert");
const MongoDB = require("./../src/db/strategies/mongodb/mongodb");
const Context = require("./../src/db/strategies/base/contextStrategy");
const HeroiSchema = require('./../src/db/strategies/mongodb/schemas/heroisSchema')

const MOCK_HEROI_CADASTRAR = {
  nome: "Batman",
  poder: "Dinheiro",
};
const MOCK_HEROI_DEFAULT = {
  nome: `Homem-Aranha-${Date.now()}`,
  poder: "Super Teia",
};

const MOCK_HEROI_ATUALIZAR = {
  nome: `Patolino-${Date.now()}`,
  poder: "Velocidade",
};
let MOCK_HEROI_ID = '';

let context = {}
describe("MongoDB Suite de Testes", function () {
  this.beforeAll(async () => {
    const connection = MongoDB.connect()
    context = new Context(new MongoDB(connection, HeroiSchema))
    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ID = result._id;
  });
  //Testes
  it("Verificar conexão", async () => {
    const result = await context.isConnected();
    const expected = "Conectado";
    assert.deepEqual(result, expected);
  });

  it("Cadastrar", async () => {
    //Destrocy
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
    // Por no BD os campos serem iguais da API eu posso passar só o nome do campo, se fosse diferente
    // eu teria que colocar {nome: nomeNoBanco, poder: poderNoBanco}
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it("Listar", async () => {
    //Destruction com array(listas): pos1 = posição 0 da lista / pos2 = posição 1 da lista
    // const [pos1, pos2, pos3] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})

    //Para pegar somente campos especificos de uma posição é só fazer assim [{nome, poder}] para cada posição, ele vai buscar os campos informados
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_DEFAULT.nome,
    });

    const result = { nome, poder };
    assert.deepEqual(result, MOCK_HEROI_DEFAULT);
  });

  it("Atualizar", async () => {
    const result = await context.update(MOCK_HEROI_ID, {
      nome: "Pernalonga",
    });
    assert.deepEqual(result.modifiedCount, 1);
  });

  it('Excluir', async () => {

    const result = await context.delete(MOCK_HEROI_ID)
    assert.deepEqual(result.deletedCount, 1);
  })
});
