const express = require('express');
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');
const { Employee, SkillGap, LearningTrack, Certification, Course, ROIMeasurement } = require('../models');
const router = express.Router();

// AI: Generate personalized learning path
router.post('/learning-path', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const skillGaps = await SkillGap.findAll({ where: { employeeId } });
    const prompt = `Generate a personalized learning and development path for this employee:
Name: ${employee.name}
Department: ${employee.department}
Position: ${employee.position}
Level: ${employee.level}
Current Skills: ${JSON.stringify(employee.skills)}
Skill Gaps: ${skillGaps.map(g => `${g.skillName} (Current: ${g.currentLevel}/5, Required: ${g.requiredLevel}/5)`).join(', ')}
Budget Available: $${employee.learningBudget - employee.budgetUsed}

Provide a structured learning path with:
1. Recommended courses and resources (with estimated costs)
2. Timeline and milestones (quarterly breakdown)
3. Priority order based on skill gaps
4. Expected outcomes and career growth trajectory
5. Specific certifications to pursue
Format the response in clear sections with bullet points.`;

    const result = await callOpenRouter(prompt);
    res.json({
      analysis: result.choices[0].message.content,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'learning-path'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Skill gap analysis
router.post('/skill-analysis', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const gaps = await SkillGap.findAll({ where: { employeeId } });
    const certs = await Certification.findAll({ where: { employeeId } });
    const prompt = `Perform a comprehensive skill gap analysis for this employee:
Name: ${employee.name}
Department: ${employee.department}
Position: ${employee.position}
Level: ${employee.level}
Current Skills: ${JSON.stringify(employee.skills)}
Current Skill Gaps: ${gaps.map(g => `${g.skillName}: Level ${g.currentLevel}/${g.requiredLevel} (${g.category})`).join(', ')}
Certifications: ${certs.map(c => `${c.name} - ${c.status}`).join(', ')}

Provide:
1. Detailed assessment of current skill levels vs industry standards
2. Critical gaps that need immediate attention
3. Skills trending in their industry that they should develop
4. Comparison with typical requirements for their next career level
5. Specific actionable recommendations with timelines
6. Risk assessment if gaps are not addressed
Format the response in clear sections with bullet points.`;

    const result = await callOpenRouter(prompt);
    res.json({
      analysis: result.choices[0].message.content,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'skill-analysis'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Course recommendations
router.post('/course-recommendations', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const gaps = await SkillGap.findAll({ where: { employeeId } });
    const courses = await Course.findAll();
    const prompt = `Recommend the best courses for this employee based on their skill gaps:
Employee: ${employee.name} - ${employee.position} in ${employee.department} (${employee.level})
Current Skills: ${JSON.stringify(employee.skills)}
Skill Gaps: ${gaps.map(g => `${g.skillName}: Level ${g.currentLevel}/${g.requiredLevel}`).join(', ')}
Available Budget: $${employee.learningBudget - employee.budgetUsed}
Available Courses in Our Catalog: ${courses.map(c => `${c.title} (${c.provider}, ${c.level}, $${c.cost}, Rating: ${c.rating})`).join('; ')}

Provide:
1. Top 5 recommended courses from our catalog with justification
2. Additional external courses/resources to consider
3. Optimal learning sequence and timeline
4. Expected skill improvement after completing each course
5. Budget optimization strategy
6. Alternative free resources for each skill area
Format the response in clear sections with bullet points.`;

    const result = await callOpenRouter(prompt);
    res.json({
      analysis: result.choices[0].message.content,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'course-recommendations'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: ROI prediction
router.post('/roi-prediction', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const rois = await ROIMeasurement.findAll({ where: { employeeId } });
    const tracks = await LearningTrack.findAll({ where: { employeeId } });
    const prompt = `Analyze and predict the ROI of learning investments for this employee:
Employee: ${employee.name} - ${employee.position} in ${employee.department}
Learning Budget: $${employee.learningBudget} (Used: $${employee.budgetUsed})
Past ROI Measurements: ${rois.map(r => `${r.programName}: Investment $${r.investmentAmount}, Return $${r.returnAmount}, ROI: ${r.roiPercentage}%`).join('; ')}
Current Learning Tracks: ${tracks.map(t => `${t.title}: ${t.status} (${t.progress}% complete)`).join('; ')}

Provide:
1. Analysis of past training ROI performance
2. Predicted ROI for current learning tracks
3. Recommendations to maximize training investment returns
4. Industry benchmark comparisons
5. Cost-benefit analysis for remaining budget allocation
6. Key performance indicators to track
7. Long-term career value projection (1-3 years)
Format the response in clear sections with bullet points.`;

    const result = await callOpenRouter(prompt);
    res.json({
      analysis: result.choices[0].message.content,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'roi-prediction'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Certification advisor
router.post('/certification-advisor', auth, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const certs = await Certification.findAll({ where: { employeeId } });
    const gaps = await SkillGap.findAll({ where: { employeeId } });
    const prompt = `Provide certification guidance for this employee:
Employee: ${employee.name} - ${employee.position} in ${employee.department} (${employee.level})
Current Skills: ${JSON.stringify(employee.skills)}
Existing Certifications: ${certs.map(c => `${c.name} by ${c.provider} (${c.status}, expires: ${c.expiryDate || 'N/A'})`).join('; ')}
Skill Gaps: ${gaps.map(g => `${g.skillName}: Level ${g.currentLevel}/${g.requiredLevel}`).join(', ')}
Budget Available: $${employee.learningBudget - employee.budgetUsed}

Provide:
1. Priority certifications to pursue next (with estimated costs and study time)
2. Certification renewal strategy for expiring credentials
3. Certification paths aligned with career progression
4. Industry-recognized certifications vs vendor-specific ones
5. Study plan and preparation resources
6. Expected salary impact of each certification
Format the response in clear sections with bullet points.`;

    const result = await callOpenRouter(prompt);
    res.json({
      analysis: result.choices[0].message.content,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'certification-advisor'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
