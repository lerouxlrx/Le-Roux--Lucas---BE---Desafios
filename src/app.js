const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const productsRouter = require('../src/routes/products.router.js');
const cartsRouter = require('../src/routes/carts.router.js');
const viewsRouter = require('../src/routes/views.router.js');
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const app = express();
const PUERTO = 8080;
//Activamos mongoose
require("./database.js")

//Conf Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars")
app.set("views", './src/views')
//Public+Middleware
app.use(express.static("./src/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, ()=>{
    console.log(`Puerto ${PUERTO} activo`)
});