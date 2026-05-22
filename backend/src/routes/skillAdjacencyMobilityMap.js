const express = require('express');
const router = express.Router();
function map(input = {}) {
  const employees = input.employees || [
    { name: 'Rae', current_role: 'Support Lead', target_role: 'Customer Success Manager', skill_overlap: 0.72, missing_skills: ['forecasting', 'QBR facilitation'] },
    { name: 'Devin', current_role: 'Analyst', target_role: 'Data Engineer', skill_overlap: 0.48, missing_skills: ['pipelines', 'orchestration'] },
  ];
  return { employees: employees.map(e => ({ ...e, readiness: e.skill_overlap >= 0.7 ? 'near_term_move' : e.skill_overlap >= 0.5 ? 'guided_path' : 'longer_path', next_learning: e.missing_skills[0] })) };
}
router.get('/', (req, res) => res.json(map()));
router.post('/map', (req, res) => res.json(map(req.body || {})));
module.exports = router;
