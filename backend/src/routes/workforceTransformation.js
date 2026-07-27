const express = require('express');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
const FEATURES = {
  'workforce-transformation': { title: 'Workforce Transformation Planner', metric: 'Hours saved / month', action: 'Advance redesign' },
  'job-exposure-redeployment': { title: 'Job Exposure & Redeployment', metric: 'Readiness %', action: 'Advance transition' },
  'learning-passport': { title: 'Employee Learning Passport', metric: 'Evidence items', action: 'Advance verification' },
  'career-resilience': { title: 'Career Resilience Coach', metric: 'Resilience score', action: 'Advance experiment' },
};
const STATES = ['assess', 'plan', 'execute', 'verify', 'complete'];

router.use(auth);
router.get('/definitions', (_req, res) => res.json({ features: FEATURES }));
router.get('/summary', async (_req, res, next) => {
  try {
    const rows = await sequelize.query(
      `SELECT feature_key, COUNT(*)::int AS records,
              COUNT(*) FILTER (WHERE status <> 'complete')::int AS open,
              ROUND(AVG(metric_value),1) AS average_metric
       FROM workforce_transformation_records GROUP BY feature_key ORDER BY feature_key`,
      { type: QueryTypes.SELECT }
    );
    res.json({ data: rows });
  } catch (error) { next(error); }
});
router.get('/records', async (req, res, next) => {
  try {
    const feature = String(req.query.feature || 'workforce-transformation');
    if (!FEATURES[feature]) return res.status(400).json({ error: 'Unknown feature' });
    const rows = await sequelize.query(
      `SELECT id,feature_key,title,owner,status,risk,metric_value,metric_unit,due_date,details,updated_at
       FROM workforce_transformation_records WHERE feature_key=:feature ORDER BY id LIMIT 100`,
      { replacements: { feature }, type: QueryTypes.SELECT }
    );
    res.json({ data: rows });
  } catch (error) { next(error); }
});
router.post('/records', async (req, res, next) => {
  try {
    const { featureKey, title, owner, risk = 'medium', metricValue = 0, details = {} } = req.body || {};
    if (!FEATURES[featureKey] || !String(title || '').trim() || !String(owner || '').trim()) {
      return res.status(422).json({ error: 'featureKey, title, and owner are required' });
    }
    const [row] = await sequelize.query(
      `INSERT INTO workforce_transformation_records(feature_key,title,owner,risk,metric_value,metric_unit,due_date,details)
       VALUES(:featureKey,:title,:owner,:risk,:metricValue,:metricUnit,CURRENT_DATE + 30,:details::jsonb)
       RETURNING *`,
      { replacements: { featureKey, title: title.trim(), owner: owner.trim(), risk, metricValue: Number(metricValue) || 0, metricUnit: FEATURES[featureKey].metric, details: JSON.stringify(details) }, type: QueryTypes.INSERT }
    );
    res.status(201).json({ data: row });
  } catch (error) { next(error); }
});
router.post('/records/:id/advance', async (req, res, next) => {
  try {
    const [current] = await sequelize.query('SELECT * FROM workforce_transformation_records WHERE id=:id', { replacements: { id: req.params.id }, type: QueryTypes.SELECT });
    if (!current) return res.status(404).json({ error: 'Record not found' });
    const nextStatus = STATES[Math.min(STATES.indexOf(current.status) + 1, STATES.length - 1)];
    const [rows] = await sequelize.query(
      `UPDATE workforce_transformation_records SET status=:nextStatus,updated_at=NOW() WHERE id=:id RETURNING *`,
      { replacements: { id: req.params.id, nextStatus }, type: QueryTypes.UPDATE }
    );
    res.json({ data: rows[0] });
  } catch (error) { next(error); }
});

module.exports = router;
