const express = require('express');
const { ROIMeasurement, Employee } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const measurements = await ROIMeasurement.findAll({ include: [{ model: Employee, attributes: ['name', 'department'] }], order: [['measurementDate', 'DESC']] });
    res.json(measurements);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const measurement = await ROIMeasurement.findByPk(req.params.id, { include: [{ model: Employee, attributes: ['name', 'department', 'position'] }] });
    if (!measurement) return res.status(404).json({ error: 'ROI measurement not found' });
    res.json(measurement);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const measurement = await ROIMeasurement.create(req.body);
    res.status(201).json(measurement);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const measurement = await ROIMeasurement.findByPk(req.params.id);
    if (!measurement) return res.status(404).json({ error: 'ROI measurement not found' });
    await measurement.update(req.body);
    res.json(measurement);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const measurement = await ROIMeasurement.findByPk(req.params.id);
    if (!measurement) return res.status(404).json({ error: 'ROI measurement not found' });
    await measurement.destroy();
    res.json({ message: 'ROI measurement deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
