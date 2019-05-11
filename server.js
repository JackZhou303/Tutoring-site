const hbs = require("handlebars");
const moment = require("moment");
const express = require("express");
const expressHbs = require("express-handlebars");
const mongodb = require("mongodb");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);


const port = process.env.PORT || 3000;

app.engine("handlebars", expressHbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

hbs.registerHelper("formatDate", (date) => {
    return moment(date).format("MMMM Do YYYY, h:mm a");
});

mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forum', (err, database) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(database);
    app.use(require("./routes/index")(database));
    require("./socket/index")(io, database);

    server.listen(port, () => {
        console.log("Listening on port", port);
    });
});
