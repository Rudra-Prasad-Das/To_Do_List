//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");

const app = express();

app.set('view engine', 'ejs');

var items=["Buy Food","Wash Hands","Eat food"];
var workItems=["Reach office","Report to Manager","Get assignment for the day"];
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  var todayDate=date();
  res.render("list",{kindOfWork:todayDate, newListItem:items})
});
app.get("/work",(req,res)=>{
  res.render("list",{kindOfWork:"Office",newListItem:workItems})
})
app.post("/",(req,res)=>{
  var item=req.body.newItem
  if(req.body.list==="Office"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
  }
  console.log(req.body.newItem);


})
app.post("/work",(req,res)=>{
  res.redirect("/work");
})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
