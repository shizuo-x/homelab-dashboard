const router = require('express').Router();
const axios = require('axios');
const Service = require('../models/service.model');

// --- GET ALL SERVICES WITH THEIR LIVE STATUS ---
router.get('/', async (req, res) => {
  try {
    const servicesFromDb = await Service.find();
    
    // Check the status of each service concurrently
    const servicesWithStatus = await Promise.all(
      servicesFromDb.map(async (service) => {
        let status = 'Offline';
        try {
          // Make a HEAD request for efficiency. Timeout after 5 seconds.
          await axios.head(service.url, { timeout: 5000 });
          status = 'Online';
        } catch (error) {
          // If the request fails for any reason, it's considered Offline
          status = 'Offline';
        }
        // Return a new object combining DB data and live status
        return {
          _id: service._id,
          name: service.name,
          url: service.url,
          status: status,
        };
      })
    );
    res.json(servicesWithStatus);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// --- ADD A NEW SERVICE ---
router.post('/add', async (req, res) => {
  try {
    const { name, url } = req.body;
    const newService = new Service({ name, url });
    await newService.save();
    res.json('Service added!');
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

module.exports = router;