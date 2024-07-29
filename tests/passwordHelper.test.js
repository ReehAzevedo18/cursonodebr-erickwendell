const assert = require('assert')
const PasswordHelper = require('./../src/helpers/passwordHelper')

const SENHA = 'Erick@321123'
const HASH = '$2b$04$kFJoNC7tpCyZHQjDc6Hc4.TYD9AKevUh.YV0d5VRolGpEWsAz4Ff.'
describe('UserHelper test suite', function (){
    it('Deve gerar um hash a partir de uma senha', async () =>{
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('Deve validar a senha a partir de um hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
})