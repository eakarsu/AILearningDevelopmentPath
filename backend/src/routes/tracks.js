const express = require('express');
const { LearningTrack, Employee } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tracks = await LearningTrack.findAll({ include: [{ model: Employee, attributes: ['name', 'department'] }], order: [['createdAt', 'DESC']] });
    res.json(tracks);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const track = await LearningTrack.findByPk(req.params.id, { include: [{ model: Employee, attributes: ['name', 'department', 'position'] }] });
    if (!track) return res.status(404).json({ error: 'Track not found' });
    res.json(track);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const track = await LearningTrack.create(req.body);
    res.status(201).json(track);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const track = await LearningTrack.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    await track.update(req.body);
    res.json(track);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const track = await LearningTrack.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    await track.destroy();
    res.json({ message: 'Track deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
