async function main(){
   

    const listItems = await model.find()
    console.log('Lista de Hérois', listItems)
}

main()