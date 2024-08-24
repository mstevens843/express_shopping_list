const express = require('express');
const router = new express.Router();
let items = require('../shoppingListDb');

// GET all items - /items 
router.get('/', function (req, res) {
    return res.json(items);
});

// POST /items - add new item
router.post("/", function (req, res) {
  const { name, price } = req.body;

  // Ensure both name and price are provided
  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const newItem = { name, price };
  shoppingList.push(newItem);
  return res.status(201).json({ added: newItem });
});



// GET item by name - /items/:name
router.get('/:name', function (req, res) {
    const item = items.find(i => i.name === req.params.name);
    if (item === undefined) {
        return res.status(404).json({ error: 'item not found'});
    }
    return res.json(item);
})



// PATCH - update single item by name - /items/:name
router.patch('/:name', function (req, res) {
    const item = items.find(i => i.name === req.params.name);
    if (item === undefined) {
        return res.status(404).json({ error: "item not found"});
    }
    item.name = req.body.name || item.name;
    item.price = req.body.price || item.price;
    return res.json({ updated: item }); 
}); 


// DELETE - delete single item by name - /items/:name
router.delete("/:name", function (req, res) {
    const itemIndex = shoppingList.findIndex(i => i.name === req.params.name);
  
    // If the item is not found, return a 404
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found" });
    }
  
    // Remove the item from the shopping list
    shoppingList.splice(itemIndex, 1);
    return res.status(200).json({ message: "Deleted" });
  });
  

module.exports = router;