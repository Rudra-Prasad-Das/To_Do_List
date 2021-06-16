//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Rudra:adminrudra@cluster0.opv7g.mongodb.net/toDolistDB", { useNewUrlParser: true, useUnifiedTopology: true })

let itemsSchema=({
  name:String
})
let listSchema=({
  name:String,
  item:[itemsSchema]
})
const Item= mongoose.model("Item",itemsSchema);  //Collection:Item Schema:itemsSchema

const List=mongoose.model("List",listSchema);

const item1 =new Item({
  name:"Brushing"
})
 const item2 =new Item({
   name:"Breakfast"
 })
 const item3=new Item({
   name:"Go to work"
 })

 const defaultItems=[item1,item2,item3];

  var todayDate=date();

app.get("/", function(req, res){

  Item.find({},(err,foundArray)=>{
    if(foundArray.length===0){
      Item.insertMany(defaultItems,(err)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Saved array to database");
        }
      })
      res.redirect("/");
    }
      else{
          res.render("list",{kindOfWork:todayDate, newListItem:foundArray})
      }

  })



});
app.get("/:customListName",(req,res)=>{
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName},(err,foundList)=>{
    if(!err){
      if(foundList){
        console.log("List exists");
          res.render("list",{kindOfWork:foundList.name, newListItem:foundList.item})
      }
      else {
        const list = new List({
          name:customListName,
          item:defaultItems
        })
        list.save();
        res.redirect("/"+customListName)
      }
    }
  })


})
app.post("/",(req,res)=>{
  var itemName=req.body.newItem;
   // WHat happens in the home route
   var buttonName=req.body.list;
    const item= new Item({
      name:itemName
    })
    if(buttonName===todayDate){
    item.save();

    res.redirect("/");
  }else{
    List.findOne({name:buttonName},{useFindAndModify:false},(err,foundList)=>{
      foundList.item.push(item);
      foundList.save();
      res.redirect("/"+buttonName)
    })
  }

  console.log(req.body.newItem);


})
app.post("/delete",(req,res)=>{
const removeItem = req.body.checkbox;
const click=req.body.listName;
console.log(click,removeItem);
if(click===todayDate){
  Item.findByIdAndRemove(removeItem,{useFindAndModify:false},(err)=>{
    if(!err){
      console.log("Removed the selected element");
      res.redirect("/");
    }
  })
}else{
  List.findOneAndUpdate({name:click},{$pull:{item:{_id:removeItem}}},{"new":true,useFindAndModify:false},(err,foundList)=>{
    if(!err){
      res.redirect("/"+click);
    }
  })
}

})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
