const Coffee = require('../models/coffeeData.model')


const getAllCoffee = async (req, reply) => {

    try {
        const coffee = await Coffee.find();
       return reply.status(200).send(coffee)
    }
    catch (err) {
       return reply.status(500).send({ error: `Server Error ${err.message}` })
    }

}


const addCoffee = async (req, reply) => {
    
    if (!req.body) {
  return reply.status(400).send({ error: "No body found" });
}
    const { name, description, roasted, ingredients, special_ingredient, prices, average_rating, ratings_count, favourite, type, imagelink_square, imagelink_portrait } = req.body;
    console.log(prices);
    
    if (!name || !description || !roasted || !ingredients || !special_ingredient || !prices || !type) {
       return reply.send("All Data Required")
    }
    


    try {
        const chk = await Coffee.create({
            name,
            description,
            roasted,
            ingredients,
            special_ingredient,
            prices,
            average_rating,
            ratings_count,
            favourite,
            type,
            imagelink_portrait,
            imagelink_square,
        })
        if (!chk) {
           return reply.send("SomeThing Went Wrong")
        }
        return reply.status(200).send("Coffee Added SuccesFully")

    }
    catch (err) {
      return  reply.status(500).send({ error: `Server Error${err.message}` })

    }
}


const deleteCoffee = async (req,reply)=>{
    const {id}= req.body

    if(!id)
    {
       return reply.send("ID Not Found")
    }

    try{
        const chk = await Coffee.findByIdAndDelete(id)
        if(!chk)
        {
           return reply.send("SomeThing Went Wrong ")
        }
        return reply.status(200).send("SuccesFully Deleted Coffee")
    }
    catch(err)
    {
       return reply.status(500).send({ error: `Server Error${err.message}` })
    }
}


module.exports={
    getAllCoffee,
    deleteCoffee,
    addCoffee,
}