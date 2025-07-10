const router = require('express').Router();
const Widget = require('../models/widget.model');
const { v4: uuidv4 } = require('uuid');

// GET THE CURRENT WIDGET LAYOUT
router.get('/layout', async (req, res) => {
  try {
    let widgets = await Widget.find();
    if (widgets.length === 0) {
      console.log("No layout found in DB, creating a default one.");
      const defaultWidget = new Widget({
        id: `systeminfo-${uuidv4()}`,
        type: 'SystemInfoWidget',
        x: 0, y: 0, w: 4, h: 4,
        config: { name: "Controller Node", ip: "127.0.0.1" }
      });
      await defaultWidget.save();
      widgets = [defaultWidget];
    }
    res.json(widgets);
  } catch (error) {
    res.status(500).json('Error: ' + error);
  }
});

// SAVE THE ENTIRE DASHBOARD LAYOUT
router.post('/layout', async (req, res) => {
    const layout = req.body;
    if (!layout || !Array.isArray(layout)) {
        return res.status(400).send('Invalid layout data');
    }
    try {
        const operations = layout.map(item => ({
            updateOne: {
                filter: { id: item.id },
                update: { $set: { ...item } },
                upsert: true
            }
        }));
        if (operations.length > 0) {
            await Widget.bulkWrite(operations);
        }
        res.status(200).send('Layout saved');
    } catch (error) {
        console.error('Error saving layout:', error);
        res.status(500).json('Error saving layout: ' + error);
    }
});

// UPDATE CONFIG FOR A SINGLE WIDGET
router.post('/widget/:id/config', async (req, res) => {
    try {
        // We use $set to only update the config property
        const updatedWidget = await Widget.findOneAndUpdate(
            { id: req.params.id },
            { $set: { config: req.body } },
            { new: true } // This option returns the document after it has been updated
        );
        if (updatedWidget) {
            res.json(updatedWidget);
        } else {
            res.status(404).send("Widget not found");
        }
    } catch (error) {
        res.status(500).json('Error: ' + error);
    }
});

// --- THIS IS THE NEW ENDPOINT ---
// UPDATE THE LAST ACCESSED TIME FOR A WIDGET
router.post('/widget/:id/accessed', async (req, res) => {
  try {
      const updatedWidget = await Widget.findOneAndUpdate(
          { id: req.params.id },
          // Use dot notation to update a nested field within the config object
          { $set: { "config.lastAccessed": new Date() } },
          { new: true }
      );
      if (updatedWidget) {
          res.json(updatedWidget);
      } else {
          res.status(404).send("Widget not found");
      }
  } catch (error) {
      res.status(500).json('Error: ' + error);
  }
});


// DELETE A SINGLE WIDGET
router.delete('/widget/:id', async (req, res) => {
    try {
        await Widget.deleteOne({ id: req.params.id });
        res.status(200).send("Widget deleted");
    } catch (error) {
        res.status(500).json('Error: ' + error);
    }
});

module.exports = router;