const express = require('express');
const { SkillGap, Employee } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const gaps = await SkillGap.findAll({ include: [{ model: Employee, attributes: ['name', 'department'] }], order: [['priority', 'ASC']] });
    res.json(gaps);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const gap = await SkillGap.findByPk(req.params.id, { include: [{ model: Employee, attributes: ['name', 'department', 'position'] }] });
    if (!gap) return res.status(404).json({ error: 'Skill gap not found' });
    res.json(gap);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const gap = await SkillGap.create(req.body);
    res.status(201).json(gap);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const gap = await SkillGap.findByPk(req.params.id);
    if (!gap) return res.status(404).json({ error: 'Skill gap not found' });
    await gap.update(req.body);
    res.json(gap);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const gap = await SkillGap.findByPk(req.params.id);
    if (!gap) return res.status(404).json({ error: 'Skill gap not found' });
    await gap.destroy();
    res.json({ message: 'Skill gap deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
