const express = require("express");
const app = express();
const port = 4000;
const alert = require("alert");

app.set("title", "MySite");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

/*Handling post requests and data*/
let date = require(__dirname + "/date.js");

/*Connecting MongoDB through mongoose*/
const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/to-do-list");
mongoose.connect(
  "mongodb+srv://ps652227:pardeep978@cluster0.wdvs1nn.mongodb.net/To-Do-ListDB"
);
const Schema = mongoose.Schema;
const model = mongoose.model;
const listItemSchema = new Schema({
  //Schema defined
  item: { type: String, unique: false},
});
const ListItemModel = new model("ListItemModel", listItemSchema); //model created
let item1 = new ListItemModel({
  item: "Welcome To Your To Do List!",
});
let item2 = new ListItemModel({
  item: "To Add a New Item, press +",
});
let item3 = new ListItemModel({
  item: "Check any Item to Remove it",
});
const startingItems =[item1, item2, item3];

app.post("/", (req, res) => {
  let listItem = req.body.itemName;
  console.log("List Item value is " + listItem);
  if (listItem != undefined) {
    //when req.body.itemName is defined or true
    let newItem = ListItemModel.create({
      //new Item created
      item: listItem,
    })
      .then((result) => {
        console.log("Successfully Added a new item with item= " + result);
        ListItemModel.find({}) //getting all the items created till now
          .then((result) => {
            console.log("Returned Array= " + result);
            res.render("list", {
              Date: date(),
              listName: "Home",
              listItems: result,
            });
          })
          .catch((err) => console.log("Error in Returning Array= " + err));
      })
      .catch((err) => {
        console.log("Error in adding the item, err= " + err);
        alert("Item Already Exists");
        // res.send("<h1>Item Already Exists!!</h1>");
      });
  }
});

app.post("/delete", (req, res) => {
  let deleteItem = req.body.checkbox;
  console.log(deleteItem);
  if (deleteItem) {
    //when req.body.checkbox is defined or true
    console.log("delete item= " + deleteItem);
    // let id=new mongoose.Types.ObjectId(deleteItem);
    // ListItemModel.deleteOne({_id:id})
    ListItemModel.deleteOne({ _id: deleteItem })
      // ListItemModel.findByIdAndRemove({_id:deleteItem})
      .then((result) => {
        console.log("Item successfully deleted with result=" + result);
        res.redirect("/");
      })
      .catch((err) => {
        console.log("Error in deleting the item with error= " + err);
        alert("Error in Deleting the Message");
      });
  }
});
app.get("/", (req, res) => {
  ListItemModel.find({})
    .then((result) => {
      console.log("Returned Array in 1st / request= " + result);
      res.render("list", { Date: date(), listName: "Home", listItems: result });
    })
    .catch((err) => console.log("Error in Returning Array= " + err));
});

//custom lists
const listSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  listItems: {
    type:[listItemSchema],
    unique:false
  }
});
const List = new mongoose.model("List", listSchema);

//custom get Requests or Dynamic routes
app.get("/:customList", (req, res) => {
  let newListName = req.params.customList;
  console.log("newListName in custom route= " + newListName);
  List.findOne({ name: newListName })
    .then((result) => {
      if (!result) {
        //new List
        console.log("List does not exist, so creating " + newListName + "list");
        let newList = new List({
          name: newListName,
          listItems: startingItems
        });
        newList
          .save()
          .then((result) => {
            console.log("Created " + newList.name + "list");
            console.log("startingItems= " + startingItems);
            console.log("newList= " + newList);
            console.log("newList.listItems= " + newList.listItems);
            // res.render("list", {
            //   Date: date(),
            //   listName: newList.name,
            //   listItems: newList.listItems,
            // });
          })
          .catch((err) => {
            alert("Error in Creating the Custom List");
            console.log("Error in creating the custom list "+err);
          });
      } else {
        //list Already Exists
        res.render("list", {
          Date: date(),
          listName: newListName,
          listItems: result.listItems,
        });
      }
    })
    .catch((err) => console.log("Error in custom routes= " + err));
});


app.listen(process.env.PORT || port, () => {
  console.log("server is up and runnig");
});
