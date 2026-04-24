const express = require('express');
const { Certification, Employee } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const certs = await Certification.findAll({ include: [{ model: Employee, attributes: ['name', 'department'] }], order: [['createdAt', 'DESC']] });
    res.json(certs);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id, { include: [{ model: Employee, attributes: ['name', 'department', 'position'] }] });
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    res.json(cert);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    await cert.update(req.body);
    res.json(cert);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const cert = await Certification.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    await cert.destroy();
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
