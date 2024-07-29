// docker ps
// docker exec -it 451f4df1af7f mongo -u renataazevedo -p 1234 --authenticationDatabase herois

// show dbs //mostrar os bancos de dados
// use herois //usando o database herois
// show collections //visualizar as tabelas (coleções)

//Inserir o objeto
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.herois.find() //buscar o objeto
db.herois.find().pretty() //identar o objeto

//Create
for(let i=0; i<= 100000; i++){
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

//Qtde
db.herois.count()

//Read
db.herois.findOne()

//Busca especifica
db.herois.find().limit(1000).sort({ nome: -1})
db.herois.findOne({_id: ObjectId("667ad7bdf258a4ec5a24a401")})

//Update Genérico
db.herois.update({_id: ObjectId("667ad7bdf258a4ec5a24a401")}, {nome: 'Mulher Maravilha'})

//Update apenas 1
db.herois.update({_id: ObjectId("667ad7bdf258a4ec5a24a401")}, {$set: {nome: 'Mulher Maravilha'}})

//Delete
db.herois.remove({_id: ObjectId("667ad6e7f258a4ec5a247d02")})
