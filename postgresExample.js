//npm install sequelize
//npm install pg-hstore pg

const Sequelize = require('sequelize')
const driver = new Sequelize(
    'herois',
    'renataazevedo',
    '1234',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main(){
    const Herois = driver.define('herois', {
        id: {
            type: Sequelize.IntegerDataTypeConstructor, 
            required: true, 
            primaryKey: true, 
            autoIncrement: true,
        }, 
        nome: {
            type: Sequelize.STRING, 
            required: true,
        },
        poder: {
            type: Sequelize.STRING, 
            required: true,
        }
}, {
    tableName: 'TB_HEROIS', 
    freezeTableName: false,
    timestamps: false
})

    await Herois.sync()
    await Herois.create({
        nome: 'Lanterna Verde',
        poder: 'Visão'
    })
    const result = await Herois.findAll({
        raw:true,
        attributes: [nome]
    })
    console.log('result:', result);
}