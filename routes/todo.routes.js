const router = require("express").Router();
const Todo = require("../models/Todo.model")

// todas nuestras rutas de ToDos

// GET "/api/todos" => enviar los titulos de los ToDos
router.get("/", async (req, res, next) => {
  try {
    const allTodoTitles = await Todo.find().select("title")
    res.json(allTodoTitles) // envia la respuesta de la BD al Frontend
  } catch (error) {
    next(error)
  }
})

// POST "/api/todos" => recibir y crear un nuevo ToDo
router.post("/", async (req, res, next) => {

  const { title, description, isUrgent } = req.body

  if (!title || !description || isUrgent === undefined) {
    res.json({errorMessage: "campos no completados"})
  }

  try {
    const newTodo = await Todo.create({
      title: title,
      description: description,
      isUrgent: isUrgent
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


module.exports = router;