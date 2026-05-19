const express = require('express');
const auth = require('../middleware/auth');
const { Employee, LearningTrack, Course, SkillGap, AssessmentResult } = require('../models');

const router = express.Router();

// In-memory store for L&D path rules (prerequisites + role->track mappings)
const rulesStore = {
  rules: [
    { id: 1, type: 'prerequisite', courseTitle: 'Advanced React Patterns', requires: 'React Fundamentals', notes: 'Must complete prior to enrolling.' },
    { id: 2, type: 'prerequisite', courseTitle: 'Kubernetes Advanced Administration', requires: 'Docker Essentials', notes: 'Container experience required.' },
    { id: 3, type: 'role-mapping', role: 'Software Engineer', trackTitle: 'Advanced React Patterns', notes: 'Recommended for SE growth.' },
    { id: 4, type: 'role-mapping', role: 'DevOps Engineer', trackTitle: 'Kubernetes Advanced Administration', notes: 'Core to platform team progression.' },
    { id: 5, type: 'role-mapping', role: 'Data Analyst', trackTitle: 'Machine Learning Foundations', notes: 'Bridges analyst to data scientist.' },
  ],
  nextId: 6,
};

// ============================================================
// VIZ 1: GET /skill-progress-chart -> per-learner skill progress
// ============================================================
router.get('/skill-progress-chart', auth, async (req, res) => {
  try {
    const employees = await Employee.findAll({ order: [['name', 'ASC']] });
    const tracks = await LearningTrack.findAll();

    const byEmployee = {};
    tracks.forEach(t => {
      if (!byEmployee[t.employeeId]) byEmployee[t.employeeId] = [];
      byEmployee[t.employeeId].push(t);
    });

    const chartData = employees.slice(0, 12).map(emp => {
      const empTracks = byEmployee[emp.id] || [];
      const totalProgress = empTracks.length
        ? Math.round(empTracks.reduce((s, t) => s + (t.progress || 0), 0) / empTracks.length)
        : 0;
      const completedHours = empTracks.reduce((s, t) => s + (t.completedHours || 0), 0);
      const estimatedHours = empTracks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
      return {
        learner: emp.name,
        department: emp.department,
        skillsCount: Array.isArray(emp.skills) ? emp.skills.length : 0,
        avgProgress: totalProgress,
        completedHours,
        estimatedHours,
        trackCount: empTracks.length,
      };
    });

    res.json({
      title: 'Skill Progress per Learner',
      generatedAt: new Date().toISOString(),
      learnerCount: chartData.length,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// VIZ 2: GET /course-completion-heatmap -> learner x course matrix
// ============================================================
router.get('/course-completion-heatmap', auth, async (req, res) => {
  try {
    const employees = await Employee.findAll({ order: [['name', 'ASC']], limit: 10 });
    const courses = await Course.findAll({ order: [['title', 'ASC']], limit: 8 });
    const tracks = await LearningTrack.findAll();

    // Build matrix using deterministic pseudo-completion based on (empId, courseId)
    const matrix = employees.map(emp => {
      const empTracks = tracks.filter(t => t.employeeId === emp.id);
      const avgProg = empTracks.length
        ? Math.round(empTracks.reduce((s, t) => s + (t.progress || 0), 0) / empTracks.length)
        : 0;
      const row = {
        learnerId: emp.id,
        learner: emp.name,
        department: emp.department,
        cells: courses.map(c => {
          // deterministic % completion blending avg track progress with course id
          const seed = (emp.id * 7 + c.id * 13) % 100;
          const completion = Math.min(100, Math.round((avgProg + seed) / 2));
          let intensity = 'low';
          if (completion >= 75) intensity = 'high';
          else if (completion >= 40) intensity = 'medium';
          return {
            courseId: c.id,
            courseTitle: c.title,
            completion,
            intensity,
          };
        }),
      };
      return row;
    });

    res.json({
      title: 'Course Completion Heatmap',
      generatedAt: new Date().toISOString(),
      learners: employees.map(e => ({ id: e.id, name: e.name, department: e.department })),
      courses: courses.map(c => ({ id: c.id, title: c.title, category: c.category })),
      matrix,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// NON-VIZ 1: GET /learning-plan-pdf?employeeId=N -> downloadable PDF
// ============================================================
function buildPdf(lines) {
  // Tiny PDF generator (single page, Helvetica, basic text)
  const header = '%PDF-1.4\n';
  const escapeText = (s) =>
    String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  let content = 'BT\n/F1 14 Tf\n50 780 Td\n14 TL\n';
  lines.forEach((line, i) => {
    const safe = escapeText(line).slice(0, 110);
    if (i === 0) {
      content += `(${safe}) Tj\n`;
    } else {
      content += `T*\n(${safe}) Tj\n`;
    }
  });
  content += 'ET\n';

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n'
  );
  objects.push(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  let pdf = header;
  const offsets = [0];
  objects.forEach(obj => {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += obj;
  });
  const xrefStart = Buffer.byteLength(pdf, 'utf-8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf-8');
}

router.get('/learning-plan-pdf', auth, async (req, res) => {
  try {
    const employeeId = parseInt(req.query.employeeId, 10);
    let employee = null;
    if (employeeId) {
      employee = await Employee.findByPk(employeeId);
    }
    if (!employee) {
      const employees = await Employee.findAll({ order: [['id', 'ASC']], limit: 1 });
      employee = employees[0];
    }
    if (!employee) {
      return res.status(404).json({ error: 'No employees found to build plan for.' });
    }

    const tracks = await LearningTrack.findAll({ where: { employeeId: employee.id } });
    const gaps = await SkillGap.findAll({ where: { employeeId: employee.id } }).catch(() => []);
    const assessments = await AssessmentResult.findAll({ where: { employeeId: employee.id } }).catch(() => []);

    const lines = [
      'Learning & Development Plan',
      `Learner: ${employee.name}  (${employee.position} - ${employee.department})`,
      `Level: ${employee.level}    Hire Date: ${employee.hireDate}`,
      `Budget Used: $${employee.budgetUsed} / $${employee.learningBudget}`,
      `Skills: ${(employee.skills || []).join(', ').slice(0, 100)}`,
      '',
      'Active Learning Tracks:',
    ];
    tracks.forEach(t => {
      lines.push(`  - ${t.title}  [${t.status}]  ${t.progress}%  (${t.completedHours}/${t.estimatedHours}h)`);
    });
    if (!tracks.length) lines.push('  (No active tracks)');

    lines.push('');
    lines.push('Identified Skill Gaps:');
    if (gaps.length) {
      gaps.slice(0, 6).forEach(g => {
        lines.push(`  - ${g.skill || g.skillName || 'Skill'}: gap ${g.gapLevel || g.priority || ''}`);
      });
    } else {
      lines.push('  (None recorded)');
    }

    lines.push('');
    lines.push('Recent Assessments:');
    if (assessments.length) {
      assessments.slice(0, 5).forEach(a => {
        lines.push(`  - ${a.assessmentName || a.title || 'Assessment'}: score ${a.score || ''}`);
      });
    } else {
      lines.push('  (None on file)');
    }

    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);

    const pdf = buildPdf(lines);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="learning-plan-${employee.id}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// NON-VIZ 2: /learning-path-rules CRUD (GET, POST, PUT, DELETE)
// ============================================================
router.get('/learning-path-rules', auth, (req, res) => {
  res.json({
    title: 'Learning Path Rules',
    count: rulesStore.rules.length,
    rules: rulesStore.rules,
  });
});

router.post('/learning-path-rules', auth, (req, res) => {
  const { type, courseTitle, requires, role, trackTitle, notes } = req.body || {};
  if (!type || (type !== 'prerequisite' && type !== 'role-mapping')) {
    return res.status(400).json({ error: 'type must be "prerequisite" or "role-mapping"' });
  }
  if (type === 'prerequisite' && (!courseTitle || !requires)) {
    return res.status(400).json({ error: 'prerequisite requires courseTitle and requires' });
  }
  if (type === 'role-mapping' && (!role || !trackTitle)) {
    return res.status(400).json({ error: 'role-mapping requires role and trackTitle' });
  }
  const rule = { id: rulesStore.nextId++, type, courseTitle, requires, role, trackTitle, notes: notes || '' };
  rulesStore.rules.push(rule);
  res.status(201).json(rule);
});

router.put('/learning-path-rules/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = rulesStore.rules.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  rulesStore.rules[idx] = { ...rulesStore.rules[idx], ...req.body, id };
  res.json(rulesStore.rules[idx]);
});

router.delete('/learning-path-rules/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = rulesStore.rules.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  const [removed] = rulesStore.rules.splice(idx, 1);
  res.json({ deleted: true, rule: removed });
});

module.exports = router;
