const router = require("express").Router();

const uploader = require("../middlewares/uploader");

// POST "/api/upload" => recibir una imagen del FE y enviarla a cloudinary. Enviar al FE el url de la imagen
router.post("/", uploader.single("image"), (req, res, next) => {

  // recibir el URL de Cloudinary como req.file.path

  if (req.file === undefined) {
    res.status(400).json({errorMessage: "Imagen en formato incorrecto/no hay imagen"})
    return
  }

  res.json({imageUrl: req.file.path})
})

module.exports = router;