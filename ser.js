const express = require("express");
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");



const { initializeApp, cert} = require("firebase-admin/app");
 const { getFirestore } = require("firebase-admin/firestore"); 

var serviceAccount = require("./key.json");

initializeApp({

credential: cert (serviceAccount),

});

const db = getFirestore();
app.get("/", function (req, res) { 
    res.sendFile(__dirname + "/public"+"/home.html");

});
app.get("/signupSubmit",function(req,res){
    console.log(req.query);

    db.collection("demo")
    .where("email","==",req.query.email)
    .get()
    .then ((docs) => {
        if (docs.size > 0){
            res.send("This accout already exists");
        }
        else{
            db.collection("demo")
            .add({
                email:req.query.email,
                password:req.query.password,
            })
            .then(() =>{
                res.sendFile(__dirname + "/public"+"/login.html");
            })
            .catch(() =>
            {
                res.send("Problem");
            })
        }
    });


});

app.get("/loginSubmit",function(req,res){

    db.collection("demo")
    .where("email","==",req.query.email)
    .where("password","==",req.query.password)
    .get()
    .then ((docs) => {
        if (docs.size > 0){
            res.sendFile(__dirname + "/public"+"/dashboard.html");}
            else{
                res.send("Fail");
            }
        });
    });

app.listen("4500");