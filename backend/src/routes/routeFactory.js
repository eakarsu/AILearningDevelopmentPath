const express = require('express');
const auth = require('../middleware/auth');

function createCrudRouter(Model, includes = []) {
  const router = express.Router();

  router.get('/', auth, async (req, res) => {
    try {
      const items = await Model.findAll({ include: includes, order: [['createdAt', 'DESC']] });
      res.json(items);
    } catch (error) { res.status(500).json({ error: error.message }); }
  });

  router.get('/:id', auth, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id, { include: includes });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (error) { res.status(500).json({ error: error.message }); }
  });

  router.post('/', auth, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (error) { res.status(500).json({ error: error.message }); }
  });

  router.put('/:id', auth, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.update(req.body);
      res.json(item);
    } catch (error) { res.status(500).json({ error: error.message }); }
  });

  router.delete('/:id', auth, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.destroy();
      res.json({ message: 'Deleted successfully' });
    } catch (error) { res.status(500).json({ error: error.message }); }
  });

  return router;
}

module.exports = createCrudRouter;
