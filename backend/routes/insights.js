const express = require('express');
const router = express.Router();
const pool = require('../server'); // Adjust if your pool file is named differently

router.get('/weekly-carbon-saved', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(
          CASE
            WHEN commute_type = 'bicycle' THEN 0.21 * commute_distance
            WHEN commute_type = 'walking' THEN 0.21 * commute_distance
            WHEN commute_type = 'public_transport' THEN 0.14 * commute_distance
            WHEN commute_type = 'motorcycle' THEN 0.10 * commute_distance
            ELSE 0
          END
          +
          CASE
            WHEN diet_type = 'vegan' THEN (6 - 2) * food_weight
            WHEN diet_type = 'pescatarian' THEN (6 - 4) * food_weight
            ELSE 0
          END
        ) AS total_carbon_saved_kg
      FROM sustainability_data
      WHERE entry_date >= NOW() - INTERVAL '7 days';
    `);

    res.json({ carbonSaved: result.rows[0].total_carbon_saved_kg || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate carbon saved' });
  }
});

module.exports = router;
