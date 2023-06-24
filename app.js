const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const _ = require("lodash");

//const date = require(__dirname+"/date.js")

// let items = ["Buy Food","Cook Food","Eat Food"];

// let workItems = [];

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://arsh:arsh%400408@cluster0.lpsvqby.mongodb.net/todolistDB" , {useNewUrlParser:true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to your todoList."
});

const item2 = new Item({
    name: "Hit + button to add items to the list."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){
    //let day = date();

    // Item.find({},function(err,foundItems){
    //     console.log(foundItems);
    // });

    Item.find({})
        .then(function (foundItems) {

            if(foundItems.length===0){
                Item.insertMany(defaultItems);
                res.redirect("/");
            }else{
                res.render("list",{listTitle:"Today" ,newListItems:foundItems});
            }
    })
        .catch(function (err) {
         console.log(err);
    });
});

// app.get("/:customListName",function(req,res){
//     const customListName = req.params.customListName;

//     List.findOne({name: customListName});

//     const list = new List({
//         name: customListName,
//         items: defaultItems
//     });
//     list.save();
// });


app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(function(foundList) {
            if (foundList) {
                // Render the existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            } else {
                // Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+ customListName);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});


app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({ name: listName })
        .then(function(foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
            });
    }
    // item=req.body.newItem;
    // // console.log(item);
    // if(req.body.list === "work"){
    //     workItems.push(item);
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
  
});

// app.post("/delete",function(req,res){
//     const checkedItemId = req.body.checkbox;
//     Item.findByIdAndRemove(checkedItemId);
// });

app.post("/delete", async (req, res) => {
    try {
        if (req.body.listName === "Today") {
            await Item.findOneAndRemove({
                _id: req.body.checkbox
            });
            res.redirect("/");
        } else {
            const foundList = await List.findOne({ name: req.body.listName });
            if (foundList) {
                foundList.items.pull({ _id: req.body.checkbox });
                await foundList.save();
                res.redirect("/" + req.body.listName);
            }
        }
    } catch (err) {
        console.log(err);
    }
});


app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/work",function(req,res){
    let item=req.body.newItem;
    // console.log(item);
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000,function(){
    console.log("Server started on port 3000");
});