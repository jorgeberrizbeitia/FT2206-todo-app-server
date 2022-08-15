const router = require("express").Router();

// GET "/api"
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const todoRoutes = require("./todo.routes")
router.use("/todos", todoRoutes)

module.exports = router;
