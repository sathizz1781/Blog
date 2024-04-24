const express      = require("express");
const mongoose     = require("mongoose");
const verifyToken  = require("./config/jwt");

const app  = express();
const db   = "mongodb://0.0.0.0:27017/blog";
const port = 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(db, {}
).then(() => 
console.log("MongoDB successfully connected")
).catch( err => 
console.log(err)
);

app.use("/api/login"   ,require("./routes/login"));
app.use("/api/signup"  ,require("./routes/register"));
app.use("/api/user"    ,verifyToken,require("./routes/user"));
app.use("/api/post"    ,verifyToken,require("./routes/post"));
app.use("/api/comment" ,verifyToken,require("./routes/comment"));

app.listen(port, () => console.log(`Server up and running on port ${port} !`));