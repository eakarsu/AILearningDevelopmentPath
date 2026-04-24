const express = require('express');
const { Course } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.findAll({ order: [['rating', 'DESC']] });
    res.json(courses);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
