const express =require("express");
const mongoose =require("mongoose");
const dotenv =require("dotenv");
const cors =require("cors");
const app =express();
const auth=require("./routes/auth");
const user=require("./routes/user");
const movie=require("./routes/movie");
const list=require("./routes/list");


dotenv.config();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("database connected succeffuly")).catch((e)=>console.log("database error",e));

app.use("/api/auth",auth);
app.use("/api/users",user);
app.use("/api/movies",movie);
app.use("/api/lists",list);

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})