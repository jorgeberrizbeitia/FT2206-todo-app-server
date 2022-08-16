const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const isAuthenticated = require("../middlewares/isAuthenticated")

// POST "/api/auth/signup" => recibir un perfil de usuario y crearlo en la BD
router.post("/signup", async (req, res, next) => {

  console.log(req.body) 
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400).json({ errorMessage: "Debes rellenar todos los campos" })
    return; // la ruta llega hasta aqui
  }

  // validaciones de password regex
  // validaciones de email regex
  // esperamos tengan muchas validaciones en los proyectos :)

  try {
    
    const foundUser = await User.findOne({ email: email })
    console.log(foundUser)
    if (foundUser !== null) {
      res.status(400).json({ errorMessage: "Ya existe un usuario con ese email" })
      return; // la ruta llega hasta aqui
    }

    // si quieren que el nombre sea unico, tambien buscan por nombre

    // encriptar la contraseña
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    // crear el usuario en la BD
    await User.create({
      username: username,
      email: email,
      password: hashPassword
    })
    res.status(201).json()

  } catch (error) {
    next(error)
  }
})

// POST "/api/auth/login" => validar las credenciales del usuario
router.post("/login", async (req, res, next) => {

  console.log(req.body)
  const { email, password } = req.body

  // todas nuestras validaciones
  if (!email || !password) {
    res.status(400).json({ errorMessage: "Debes rellenar todos los campos" })
    return; // la ruta llega hasta aqui
  }

  try {

    const foundUser = await User.findOne({ email: email })
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "Usuario no registrado" })
      return;
    }

    // verificamos la contraseña
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    console.log("isPasswordValid", isPasswordValid)
    if (isPasswordValid === false) {
      res.status(400).json({ errorMessage: "Contraseña no valida" })
      return;
    }

    // ok, el usuario es quien dice ser.
    // el usuario está validado
    // creariamos la session... SI estuviesemos trabajando con sesiones.
    // pero en vez, vamos a crear un Token para trabajar con JWT

    // crear el payload
    const payload = {
      _id: foundUser._id,
      email: foundUser.email
    } // el payload será como el req.session.user

    // generar el token
    const authToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { algorithm: "HS256", expiresIn: "6h" }
    )

    res.json({ authToken: authToken })
  } catch (error) {
    next(error)
  }
})

// GET "/api/auth/verify" => verificar que el usuario ya ha sido validado y está activo
router.get("/verify", isAuthenticated, (req, res, next) => {

  console.log("aqui vamos a verificar el token")
  console.log(req.payload)
  // si queremos informacion de el usuario que esta accediendo a la ruta, req.payload
  // req.payload === req.session.user
  // tenemos acceso a req.payload SOLO si usamos el middleware isAuthenticated

  res.json(req.payload)

})

module.exports = router;