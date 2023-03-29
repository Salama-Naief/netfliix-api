const router = require("express").Router();
const List = require("../models/list");
const auth = require("../middleware/auth");

//CREATE list
router.post("/create", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const newList = new List(req.body);
      const list = await newList.save();
      res.status(201).json({ msg: "list created succeffuly" });
    } else {
      return res.status(404).json({ msg: "you not allowed to create list" });
    }
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

//UPDATE list
router.put("/update/:id", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const list = await List.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(201).json({ msg: "list updated succesfully" });
    } else {
      return res.status(404).json({ msg: "you not allowed to update list" });
    }
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

//delete
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json({ msg: "list deleted succesfully" });
    } else {
      return res.status(404).json({ msg: "you not allowed to delete list" });
    }
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

//get lists
router.get("/getlist", async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;

  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { genre: genreQuery, type: typeQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});
module.exports = router;
