const { join } = require("path")
const express = require("express")
const hbs = require("hbs")
const request = require("request")

const { geocode, forecast } = require("./utils")

const port = 3000

// define pathe for Express config
const publicDir = join(__dirname, "../public")
const viewsDir = join(__dirname, "../templates/views")
const partialsDir = join(__dirname, "../templates/partials")

hbs.registerPartials(partialsDir)

const app = express()

// setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsDir)

// setup static directory to serve
app.use(express.static(publicDir))

app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Antonio D'Onchia"
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Antonio D'Onchia"
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "This is the Help page!",
    name: "Antonio D'Onchia"
  })
})

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    res.send({ error: "No address provided." })
  } else {
    geocode(req.query.address, (error, { lat, lon, location } = {}) => {
      if (error) {
        res.send({ error })
      } else {
        forecast(lat, lon, (error, forecastData) => {
          if (error) {
            res.send({ error })
          } else {
            res.send({
              forecast: forecastData,
              location,
              address: req.query.address
            })
          }
        })
      }
    })
  }
})

app.get("/products", (req, res) => {
  if (!req.query.search) {
    res.send({ error: "No seacrh term provided." })
  } else {
    console.log("Search Term:", req.query.search)
    res.send({ products: [] })
  }
})

// 404 routes handlers
app
  .get("/help/*", (req, res) => {
    res.render("404", {
      title: "404",
      message: "Sorry. Help article not found",
      name: "Antonio D'onchia"
    })
  })
  .get("*", (req, res) => {
    res.render("404", {
      title: "404",
      message: "Sorry. Page not found.",
      name: "Antonio D'onchia"
    })
  })

app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
})
