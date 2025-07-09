const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  x: { type: Number, required: true, default: 0 },
  y: { type: Number, required: true, default: 0 },
  w: { type: Number, required: true, default: 4 },
  h: { type: Number, required: true, default: 4 }, // Increased default height
  // --- THIS IS THE KEY CHANGE ---
  // A flexible field to store widget-specific settings.
  config: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Widget = mongoose.model('Widget', widgetSchema);

module.exports = Widget;