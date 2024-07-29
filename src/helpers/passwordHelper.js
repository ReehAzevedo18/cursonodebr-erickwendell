const Bcrypt = require('bcrypt')
const {
    promisify
} = require('util')

const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PWD)

class PasswordHelper {

    //Cria o hash de senha
    static hashPassword(pass){
        return hashAsync(pass, 3)
    }

    //Compara a senha com o hash gerado
    static comparePassword(pass, hash){
        return compareAsync(pass, hash)
    }
}

module.exports = PasswordHelper