const router = require('express').Router();
const Widget = require('../models/widget.model');
const { v4: uuidv4 } = require('uuid'); // We need uuid on the backend now

// --- THIS IS THE FIX FOR THE RACE CONDITION ---
// GET THE CURRENT WIDGET LAYOUT
router.get('/layout', async (req, res) => {
  try {
    let widgets = await Widget.find();
    // If the database is empty, create and save a default widget layout.
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

// POST /layout (logic is now simpler as upsert is more reliable)
router.post('/layout', async (req, res) => { const layout = req.body; if (!layout || !Array.isArray(layout)) { return res.status(400).send('Invalid layout data'); } try { const operations = layout.map(item => ({ updateOne: { filter: { id: item.id }, update: { $set: { ...item } }, upsert: true } })); if (operations.length > 0) { await Widget.bulkWrite(operations); } res.status(200).send('Layout saved'); } catch (error) { console.error('Error saving layout:', error); res.status(500).json('Error saving layout: ' + error); } });

// UPDATE CONFIG FOR A SINGLE WIDGET
router.post('/widget/:id/config', async (req, res) => { /* ... (Unchanged) ... */ try{const t=await Widget.findOneAndUpdate({id:req.params.id},{$set:{config:req.body}},{new:!0});t?res.json(t):res.status(404).send("Widget not found")}catch(t){res.status(500).json("Error: "+t)} });

// DELETE /widget/:id
router.delete('/widget/:id', async (req, res) => { /* ... (Unchanged) ... */ try{await Widget.deleteOne({id:req.params.id}),res.status(200).send("Widget deleted")}catch(t){res.status(500).json("Error: "+t)} });

module.exports = router;