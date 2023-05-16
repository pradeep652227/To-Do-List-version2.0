const express = require("express");
const app = express();
const port = 4000;
const alert = require("alert");

app.set("title", "MySite");
app.use(express.urlencoded({ extended: true })); //for body-parser
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
const listItemSchema = new Schema(
  {
    //list Items Schema
    //Schema defined
    item: { type: String, unique: true },
  },
  { timestamps: true }
);
const ListItemModel = new model("ListItemModel", listItemSchema); //model created
<<<<<<< HEAD

const item1 = new ListItemModel({
  item: "Welcome To Your To Do List!",
});
const item2 = new ListItemModel({
  item: "To Add a New Item, press +",
});
const item3 = new ListItemModel({
  item: "Check any Item to Remove it",
});
const startingItems = [item1, item2, item3]; //default list
=======
// let item1 = new ListItemModel({
//   item: "Welcome To Your To Do List!",
// });
// let item2 = new ListItemModel({
//   item: "To Add a New Item, press +",
// });
// let item3 = new ListItemModel({
//   item: "Check any Item to Remove it",
// });
// const startingItems =[item1, item2, item3];
>>>>>>> 52f1026131c12e14080fbd0a6899f1b22f3c6b48

//custom lists
const listSchema = new mongoose.Schema(
  {
    name: String,
    listItems: [listItemSchema],
  },
  { timestamps: true }
);
const List = new mongoose.model("List", listSchema);

//custom get Requests or Dynamic routes
app.get("/lists/:customList", (req, res) => {
  let newListName = req.params.customList.toLowerCase();
  newListName = newListName.charAt(0).toUpperCase() + newListName.slice(1);
  console.log("newListName with first letter as capital= " + newListName);
  console.log("Listname= " + newListName);

  if (newListName.toLowerCase() == "home") {
    res.redirect("/");
  } else {
    console.log("ListName in custom route= " + newListName);
    List.findOne({ name: newListName }) //finding the custom list
      .then((result) => {
        if (!result) {
          //new List
          console.log(
            "List does not exist, so creating " + newListName + "list"
          );
          List.create({
            name: newListName,
            listItems: startingItems,
          })
<<<<<<< HEAD
            .then((result) => {
              console.log("Saved the item= " + result.name);
              res.render("list", {
                Date: date(),
                listName: newListName,
                listItems: result.listItems,
              });
            })
            .catch((err) => console.log("Error in Saving the list= " + err));
        } else {
          //list Already Exists
          let items = result.listItems;
          if (items.length == 0) {
            result.listItems = startingItems;
            result.save();
          }
          console.log("List Already Exists");
          res.render("list", {
            Date: date(),
            listName: newListName,
            listItems: result.listItems,
          });
        }
=======
         .catch((err) => {console.log("Error in Returning Array= " + err); alert("Error in Retrieving the Data, Kindly Try Again");});
>>>>>>> 52f1026131c12e14080fbd0a6899f1b22f3c6b48
      })
      .catch((err) => {
        console.log("Error in custom routes= " + err);
        alert(
          "Error in creating/finding the custom list. Kindly try again or try other lists at /lists/"
        );
      });
  }
});

//post requests
app.post("/", (req, res) => {
  let listItem = req.body.itemName; //item to add
  if (listItem != undefined) {
    let listName = req.body.listName; //listName to add the new item to
    if (listName != "Home") {
      //adding to the custom list
      List.findOne({ name: listName })
        .then((result) => {
          console.log(
            "Adding an item to the list " +
              result.name +
              " previous items= " +
              result.listItems.length
          );
          let newItem = new ListItemModel({
            item: listItem,
          }); //new Item created but not saved (individually)
          result.listItems.push(newItem); //adding the item to the items array of that custom list
          console.log(
            "Added the item= " +
              result.listItems +
              " new items= " +
              result.listItems.length
          );
          result.save(); //saving the custom list
          res.redirect("/lists/" + listName);
        })
        .catch((err) => {
          console.log(
            "Error in finding the list for " + listName + " err= " + err
          );
          alert(
            "Error in finding your list. Kindly try again or try with different lists at /lists/"
          );
        });
    } else {
      //adding to the 'home' list
      console.log("List Item value is " + listItem);
      //when req.body.itemName is defined or true
      let newItem = ListItemModel.create({
        //new Item created
        item: listItem,
      }) //adding and saving the new item
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
            .catch((err) => {
              console.log("Error in Returning Array= " + err);
              alert(
                "Error in Returning Array, kindly try again or try with other lists at /lists/"
              );
            });
        })
        .catch((err) => {
          console.log("Error in adding the item, err= " + err);
          alert("Item Already Exists");
          // res.send("<h1>Item Already Exists!!</h1>");
        });
    }
  }
});

app.post("/delete", (req, res) => {
  let deleteItem = req.body.checkbox; //id of the item to delete
  let listName = req.body.listName.toLowerCase(); //name of the list in which the item to be deleted is
  listName = listName.charAt(0).toUpperCase() + listName.slice(1);
  console.log("Item/List to Delete= " + deleteItem);
  console.log(req.body);

  if (listName.toLowerCase() == "home") {
    //item is in the home list
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
  } else {
    //item is in the custom list
    console.log("Deleting an item of a list");
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { listItems: { _id: deleteItem } } }
    )
      .then((result) => {
        console.log(
          "Item deleted from findOneAndUpdate with result= " + result
        );
        result.save();
        res.redirect("/lists/" + listName);
      })
      .catch((err) => {
        console.log("Error in deleting with findOneAndUpdate, err=" + err);
        alert(
          "Error in Deleting the item. Maybe there's a server error. Kindly try after some time or try with different list at /lists/"
        );
      });
    /* List.findOne({ name: listName }) //find the list
      .then((result) => {
        console.log("List Found= " + result);
        let items = result.listItems;
        items.pull({ _id: deleteItem }); //remove the item
        result.save(); // saving the list
        res.redirect("/lists/" + listName);
        // items.forEach(listItem=>{// traverse the items array in the list
        //   console.log("List item= "+listItem);
        //   if(listItem._id==deleteItem){
        //     console.log("deleting the item= "+listItem.item);
        //      items.pull({_id:listItem._id}); //remove the item
        //      result.save();// saving the list
        //      res.redirect("/lists/"+listName);
        //   }
        // });
      })
      .catch((err) =>{console.log("Error in traversing the items array " + err);
          alert("Error in Deleting the item. Maybe there's a server error. Kindly try after some time or try with different list at /lists/");
    }    
      );*/
  }
});
app.get("/", (req, res) => {
  ListItemModel.find({})
<<<<<<< HEAD
    .then((resultArr) => {
      console.log("Returned Array in 1st / request= " + resultArr);
      if (resultArr.length == 0) {
        ListItemModel.insertMany(startingItems)
          .then((resultArr) => {
            console.log("Inserted starting elements in home list");
            res.redirect("/");
=======
    .then((result) => {
      console.log("Returned Array in 1st / request= " + result);
      res.render("list", { Date: date(), listName: "Home", listItems: result });
    })
    .catch((err) => {console.log("Error in Returning Array= " + err); alert("Error in Retrieving the Data, Kindly Try Again");});
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
/*app.get("/:customList", (req, res) => {
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
>>>>>>> 52f1026131c12e14080fbd0a6899f1b22f3c6b48
          })
          .catch((err) => {
            console.log(
              "Error in inserting starting elements to home list" + err
            );
            alert(
              "Can not render the home list right now. Try different lists at /lists/"
            );
          });
      } else {
        res.render("list", {
          Date: date(),
          listName: "Home",
          listItems: resultArr,
        });
      }
    })
    .catch((err) => console.log("Error in Returning Array= " + err));
});
<<<<<<< HEAD
=======
*/

>>>>>>> 52f1026131c12e14080fbd0a6899f1b22f3c6b48
app.listen(process.env.PORT || port, () => {
  console.log("server is up and runnig");
});
