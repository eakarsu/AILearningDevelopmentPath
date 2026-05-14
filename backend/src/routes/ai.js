const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { callOpenRouter, parseAIJson } = require('../services/openrouter');
const { Employee, SkillGap, LearningTrack, Certification, Course, ROIMeasurement, SuccessionPlan, LearningBudget } = require('../models');
const router = express.Router();

// AI: Generate personalized learning path (structured JSON output)
router.post('/learning-path', auth, aiRateLimiter, async (req, res) => {
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

Return ONLY valid JSON: { recommended_courses: [{course_name, duration_weeks, priority, reason}], timeline_months, certifications_to_pursue: [{name, provider, estimated_cost}], weekly_hours_commitment, total_budget_estimate }`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    const structured = parseAIJson(rawText);

    // Auto-create LearningTrack rows if structured result is available
    let tracksCreated = 0;
    if (structured && structured.recommended_courses && Array.isArray(structured.recommended_courses)) {
      for (const course of structured.recommended_courses) {
        try {
          await LearningTrack.create({
            employeeId: parseInt(employeeId),
            title: course.course_name,
            category: 'AI Recommended',
            description: course.reason || '',
            status: 'Not Started',
            priority: ['High', 'Medium', 'Low'].includes(course.priority) ? course.priority : 'Medium',
            progress: 0,
          });
          tracksCreated++;
        } catch(e) { /* skip if create fails */ }
      }
    }

    res.json({
      analysis: rawText,
      structured,
      tracks_auto_created: tracksCreated,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'learning-path'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Skill gap analysis
router.post('/skill-analysis', auth, aiRateLimiter, async (req, res) => {
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

Provide a detailed analysis in clear sections with bullet points covering: current skill levels vs industry standards, critical gaps, trending skills, career level comparison, actionable recommendations, and risk assessment.`;

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

// AI: Course recommendations (structured)
router.post('/course-recommendations', auth, aiRateLimiter, async (req, res) => {
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

Provide recommendations in clear sections with bullet points covering: top 5 recommended courses with justification, additional external resources, optimal learning sequence, expected skill improvement, budget optimization, and alternative free resources.`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    res.json({
      analysis: rawText,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'course-recommendations'
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: ROI prediction
router.post('/roi-prediction', auth, aiRateLimiter, async (req, res) => {
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

Provide analysis in clear sections covering: past training ROI, predicted ROI for current tracks, recommendations to maximize returns, industry benchmarks, cost-benefit analysis, KPIs to track, and long-term career value projection (1-3 years).`;

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
router.post('/certification-advisor', auth, aiRateLimiter, async (req, res) => {
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

Provide guidance in clear sections covering: priority certifications to pursue, renewal strategy, certification paths aligned with career progression, industry vs vendor certs, study plan, and expected salary impact.`;

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

// Apply learning plan — auto-create LearningTrack rows from structured plan
router.post('/apply-learning-path', auth, async (req, res) => {
  try {
    const { employeeId, plan } = req.body;
    if (!employeeId || !plan) return res.status(400).json({ error: 'employeeId and plan are required' });

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const courses = plan.recommended_courses || [];
    let tracksCreated = 0;

    for (const course of courses) {
      try {
        await LearningTrack.create({
          employeeId: parseInt(employeeId),
          title: course.course_name,
          category: 'AI Recommended',
          description: course.reason || '',
          status: 'Not Started',
          priority: ['High', 'Medium', 'Low'].includes(course.priority) ? course.priority : 'Medium',
          progress: 0,
        });
        tracksCreated++;
      } catch(e) { /* skip individual failures */ }
    }

    res.json({ tracks_created: tracksCreated, plan_applied: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Peer / mentor match advisor
router.post('/peer-match-advisor', auth, aiRateLimiter, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const gaps = await SkillGap.findAll({ where: { employeeId } });
    const candidates = await Employee.findAll({ limit: 50 });
    const peerSummaries = candidates
      .filter(e => e.id !== employee.id)
      .slice(0, 30)
      .map(e => `id=${e.id}; ${e.name}; ${e.position} (${e.level}); skills=${JSON.stringify(e.skills)}`)
      .join('\n');

    const prompt = `Match this employee to internal mentors / peer learning partners.
Employee: ${employee.name} — ${employee.position} (${employee.level}), Department: ${employee.department}
Current Skills: ${JSON.stringify(employee.skills)}
Skill Gaps: ${gaps.map(g => `${g.skillName} (${g.currentLevel}->${g.requiredLevel})`).join(', ') || 'none'}

Candidate peers (employee_id, role, skills):
${peerSummaries}

Return ONLY valid JSON: { matches: [{ employee_id, name, match_score (0-100), reason, recommended_format ("1:1 mentor" | "peer pair" | "shadow") }], advice }`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    const structured = parseAIJson(rawText);
    res.json({
      analysis: rawText,
      structured,
      model: result.model,
      usage: result.usage,
      employee: employee.name,
      type: 'peer-match-advisor',
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Training effectiveness analyzer
router.post('/training-effectiveness-analyzer', auth, aiRateLimiter, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const where = employeeId ? { employeeId } : {};
    const tracks = await LearningTrack.findAll({ where });
    const rois = await ROIMeasurement.findAll({ where });

    const prompt = `Assess which trainings drive performance and identify under-performing investments.

Tracks (${tracks.length}): ${tracks.map(t => `${t.title} [${t.status}, ${t.progress}%]`).join('; ') || 'none'}
ROI records (${rois.length}): ${rois.map(r => `${r.programName}: $${r.investmentAmount}->$${r.returnAmount} (${r.roiPercentage}%)`).join('; ') || 'none'}

Return ONLY valid JSON: { high_impact_trainings: [{ name, evidence }], low_impact_trainings: [{ name, evidence }], overall_effectiveness_score (0-100), recommended_continue: [], recommended_discontinue: [], measurement_gaps: [] }`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    const structured = parseAIJson(rawText);
    res.json({
      analysis: rawText,
      structured,
      model: result.model,
      usage: result.usage,
      employeeId: employeeId || null,
      type: 'training-effectiveness-analyzer',
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Succession planner — recommend successors per role + readiness gap plan
router.post('/succession-planner', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }
    const { roleTitle, department, urgencyMonths } = req.body;
    const employees = await Employee.findAll({ limit: 80 });
    const existingPlans = SuccessionPlan ? await SuccessionPlan.findAll({ limit: 50 }) : [];

    const empSummaries = employees.slice(0, 50)
      .map(e => `id=${e.id}; ${e.name}; ${e.position} (${e.level}); dept=${e.department}; skills=${JSON.stringify(e.skills)}`)
      .join('\n');
    const planSummaries = (existingPlans || []).slice(0, 30)
      .map(p => `candidate=${p.candidateId}; role=${p.targetRole || p.roleTitle || ''}; readiness=${p.readinessLevel || p.status || ''}`)
      .join('\n');

    const prompt = `Recommend internal successors for the role and produce a readiness plan per candidate.
Target role: ${roleTitle || 'unspecified'}
Department: ${department || 'any'}
Urgency: ${urgencyMonths ? urgencyMonths + ' months' : 'normal'}

Existing succession plans:
${planSummaries || 'none'}

Candidate pool:
${empSummaries}

Return ONLY valid JSON: { successors: [{ employee_id, name, readiness ("ready_now"|"1-2_years"|"3-5_years"), match_score (0-100), strengths: [], gaps: [], development_actions: [] }], top_pick_employee_id, succession_risk: "low"|"medium"|"high", advice }`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    const structured = parseAIJson(rawText);
    res.json({
      analysis: rawText,
      structured,
      model: result.model,
      usage: result.usage,
      roleTitle: roleTitle || null,
      type: 'succession-planner',
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// AI: Budget optimizer — allocate L&D spend across employees / cohorts
router.post('/budget-optimizer', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }
    const { totalBudgetUsd, fiscalPeriod, priorities } = req.body;
    const employees = await Employee.findAll({ limit: 80 });
    const gaps = await SkillGap.findAll({ limit: 200 });
    const budgets = LearningBudget ? await LearningBudget.findAll({ limit: 100 }) : [];

    const empSummaries = employees.slice(0, 40)
      .map(e => `id=${e.id}; ${e.name}; ${e.position}/${e.level}; dept=${e.department}; budget=$${e.learningBudget}; used=$${e.budgetUsed}`)
      .join('\n');
    const gapSummaries = gaps.slice(0, 40)
      .map(g => `emp=${g.employeeId}; ${g.skillName}: ${g.currentLevel}->${g.requiredLevel} (${g.category})`)
      .join('\n');
    const budgetSummaries = (budgets || []).slice(0, 20)
      .map(b => `team=${b.teamName || b.id}; allocated=$${b.totalBudget || b.amount || 0}; remaining=$${b.remainingBudget || 0}`)
      .join('\n');

    const prompt = `Recommend an optimal allocation of the L&D budget across employees / cohorts to maximize ROI and close the most critical skill gaps.
Total budget: $${totalBudgetUsd || 'unspecified'}
Fiscal period: ${fiscalPeriod || 'next 12 months'}
Priorities: ${priorities || 'high-impact gaps + critical roles'}

Employees:
${empSummaries}

Skill gaps:
${gapSummaries || 'none'}

Existing team budgets:
${budgetSummaries || 'none'}

Return ONLY valid JSON: { allocations: [{ employee_id, name, allocation_usd, focus_area, expected_outcome, justification }], cohort_allocations: [{ cohort, allocation_usd, focus_area }], unallocated_reserve_usd, expected_total_roi_pct, top_risks_if_under_funded: [], advice }`;

    const result = await callOpenRouter(prompt);
    const rawText = result.choices[0].message.content;
    const structured = parseAIJson(rawText);
    res.json({
      analysis: rawText,
      structured,
      model: result.model,
      usage: result.usage,
      totalBudgetUsd: totalBudgetUsd || null,
      type: 'budget-optimizer',
    });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
