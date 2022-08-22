const router = require("express").Router();
const Todo = require("../models/Todo.model")

// todas nuestras rutas de ToDos

const isAuthenticated = require("../middlewares/isAuthenticated")

// GET "/api/todos" => enviar los titulos de los ToDos
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allTodoTitles = await Todo.find().select("title")
    res.json(allTodoTitles) // envia la respuesta de la BD al Frontend
  } catch (error) {
    next(error)
  }
})

// POST "/api/todos" => recibir y crear un nuevo ToDo
router.post("/", async (req, res, next) => {

  const { title, description, isUrgent, image } = req.body

  if (!title || !description || isUrgent === undefined) {
    res.json({errorMessage: "campos no completados"})
  }

  try {
    const newTodo = await Todo.create({
      title: title,
      description: description,
      isUrgent: isUrgent,
      image: image
    })

    res.json(newTodo)
  } catch (error) {
    next(error)
  }
})

// GET "/api/todos/:id" => enviar los detalles de un ToDo especifico
router.get("/:id", async (req, res, next) => {

  const { id } = req.params

  try {
    const singleTodo = await Todo.findById(id)

    res.json(singleTodo)
  } catch (error) {
    next(error)
  }

})

// DELETE "/api/todos/:id" => borrar un ToDo por su id
router.delete("/:id", async (req, res, next) => {

  try {
    
    await Todo.findByIdAndDelete(req.params.id)
    // res.status(200).json()
    res.json("elemento borrado")

  } catch (error) {
    next(error)
  }

})

// PATCH "/api/todos/:id" => recibir cambios y editar un ToDo por su id
router.patch("/:id", async (req, res, next) => {

  const { id } = req.params
  const { title, description, isUrgent } = req.body

  try {

    await Todo.findByIdAndUpdate(id, {
      title: title,
      description: description,
      isUrgent: isUrgent
    })

    res.json("documento actualizado")
    
  } catch (error) {
    next(error)
  }

})

const stripe = require("stripe")('sk_test_51Jw5EKCKKbaZslJcK9Ut1BDvKJHOeByhviy6AHFgQts2K8NRt4LCZWjQyb53cxsX9KM3wdOsYiLM0zubBIvyROAf00SKd7LHa5');

// POST "/api/todo/create-payment-intent" => enviar el producto que el usuario quiere comprar a stripe para generar un intento de pago
router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log(items)

  const productToBuy = await Todo.findById(items[0]._id)

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: productToBuy.price * 100, // el valor que el usuario va a pa
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


module.exports = router;