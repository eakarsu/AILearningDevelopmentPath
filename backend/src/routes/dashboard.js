const express = require('express');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { Employee, LearningTrack, SkillGap, Certification, Course, ROIMeasurement,
  ComplianceTraining, TrainingEvent, LearningBudget, MentorshipProgram, PerformanceReview,
  CompetencyFramework, OnboardingPlan, TeamGoal, KnowledgeBase, FeedbackSurvey,
  SuccessionPlan, CareerPath, LearningResource, AssessmentResult, WellnessProgram } = require('../models');

const router = express.Router();

// Dashboard analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const [employees, tracks, skillGaps, certifications, roi, budgets] = await Promise.all([
      Employee.findAll(),
      LearningTrack.findAll(),
      SkillGap.findAll(),
      Certification.findAll(),
      ROIMeasurement.findAll(),
      LearningBudget.findAll(),
    ]);

    // Department distribution
    const deptMap = {};
    employees.forEach(e => {
      const dept = e.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const departmentDistribution = Object.entries(deptMap).map(([name, value]) => ({ name, value }));

    // Skill gaps by priority
    const gapPriorityMap = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    skillGaps.forEach(g => {
      if (gapPriorityMap.hasOwnProperty(g.priority)) gapPriorityMap[g.priority]++;
    });
    const skillGapsByPriority = Object.entries(gapPriorityMap).map(([name, value]) => ({ name, value }));

    // Track status distribution
    const trackStatusMap = {};
    tracks.forEach(t => {
      const status = t.status || 'Unknown';
      trackStatusMap[status] = (trackStatusMap[status] || 0) + 1;
    });
    const tracksByStatus = Object.entries(trackStatusMap).map(([name, value]) => ({ name, value }));

    // ROI trend (last 12 entries sorted by date)
    const roiTrend = roi
      .sort((a, b) => new Date(a.measurementDate) - new Date(b.measurementDate))
      .slice(-12)
      .map(r => ({
        name: r.programName?.substring(0, 15) || 'Program',
        roi: parseFloat(r.roiPercentage) || 0,
        investment: parseFloat(r.investmentAmount) || 0,
        return: parseFloat(r.returnAmount) || 0,
      }));

    // Budget utilization by department
    const budgetUtil = budgets.map(b => ({
      name: b.department || 'Unknown',
      total: parseFloat(b.totalBudget) || 0,
      spent: parseFloat(b.spent) || 0,
      remaining: parseFloat(b.remaining) || 0,
    }));

    // Certification status breakdown
    const certStatusMap = {};
    certifications.forEach(c => {
      const status = c.status || 'Unknown';
      certStatusMap[status] = (certStatusMap[status] || 0) + 1;
    });
    const certsByStatus = Object.entries(certStatusMap).map(([name, value]) => ({ name, value }));

    // Monthly track progress (average progress by month of creation)
    const monthlyProgress = {};
    tracks.forEach(t => {
      const month = t.createdAt ? new Date(t.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' }) : 'Unknown';
      if (!monthlyProgress[month]) monthlyProgress[month] = { total: 0, count: 0 };
      monthlyProgress[month].total += parseFloat(t.progress) || 0;
      monthlyProgress[month].count++;
    });
    const trackProgressTrend = Object.entries(monthlyProgress).map(([name, d]) => ({
      name,
      avgProgress: Math.round(d.total / d.count),
    }));

    res.json({
      departmentDistribution,
      skillGapsByPriority,
      tracksByStatus,
      roiTrend,
      budgetUtilization: budgetUtil,
      certsByStatus,
      trackProgressTrend,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const notifications = [];

    // Expiring certifications (within 30 days)
    const certs = await Certification.findAll({
      include: [{ model: Employee, attributes: ['name'] }],
    });
    certs.forEach(c => {
      if (c.expiryDate) {
        const expiry = new Date(c.expiryDate);
        if (expiry <= thirtyDaysFromNow && expiry >= now && c.status === 'Active') {
          const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
          notifications.push({
            id: `cert-${c.id}`,
            type: 'warning',
            category: 'Certification',
            title: `${c.name} expiring soon`,
            message: `${c.Employee?.name || 'Employee'}'s ${c.name} expires in ${daysLeft} days`,
            date: c.expiryDate,
            link: '/certifications',
          });
        }
        if (expiry < now && c.status === 'Active') {
          notifications.push({
            id: `cert-expired-${c.id}`,
            type: 'danger',
            category: 'Certification',
            title: `${c.name} has expired`,
            message: `${c.Employee?.name || 'Employee'}'s ${c.name} expired on ${expiry.toLocaleDateString()}`,
            date: c.expiryDate,
            link: '/certifications',
          });
        }
      }
    });

    // Overdue compliance training
    const compliances = await ComplianceTraining.findAll({
      include: [{ model: Employee, attributes: ['name'] }],
    });
    compliances.forEach(c => {
      if (c.dueDate && c.status !== 'Completed') {
        const due = new Date(c.dueDate);
        if (due < now) {
          notifications.push({
            id: `comp-${c.id}`,
            type: 'danger',
            category: 'Compliance',
            title: `Overdue: ${c.trainingName}`,
            message: `${c.Employee?.name || 'Employee'} has overdue compliance training`,
            date: c.dueDate,
            link: '/compliance',
          });
        } else if (due <= thirtyDaysFromNow) {
          const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
          notifications.push({
            id: `comp-due-${c.id}`,
            type: 'warning',
            category: 'Compliance',
            title: `${c.trainingName} due soon`,
            message: `${c.Employee?.name || 'Employee'} - due in ${daysLeft} days`,
            date: c.dueDate,
            link: '/compliance',
          });
        }
      }
    });

    // Upcoming training events (within 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const events = await TrainingEvent.findAll();
    events.forEach(e => {
      if (e.startDate) {
        const start = new Date(e.startDate);
        if (start >= now && start <= sevenDaysFromNow && e.status !== 'Cancelled') {
          const daysLeft = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
          notifications.push({
            id: `event-${e.id}`,
            type: 'info',
            category: 'Training Event',
            title: `Upcoming: ${e.title}`,
            message: `${e.type} starts in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} - ${e.enrolled || 0}/${e.capacity || '?'} enrolled`,
            date: e.startDate,
            link: '/training-events',
          });
        }
      }
    });

    // Low budget warnings
    const lowBudgets = await LearningBudget.findAll();
    lowBudgets.forEach(b => {
      const remaining = parseFloat(b.remaining) || 0;
      const total = parseFloat(b.totalBudget) || 1;
      if (remaining / total < 0.1 && b.status === 'Active') {
        notifications.push({
          id: `budget-${b.id}`,
          type: 'warning',
          category: 'Budget',
          title: `Low budget: ${b.department}`,
          message: `${b.department} has only $${remaining.toLocaleString()} remaining (${Math.round(remaining/total*100)}%)`,
          date: new Date().toISOString(),
          link: '/learning-budgets',
        });
      }
    });

    // Sort by urgency: danger first, then warning, then info
    const typeOrder = { danger: 0, warning: 1, info: 2 };
    notifications.sort((a, b) => (typeOrder[a.type] || 3) - (typeOrder[b.type] || 3));

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global search
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const searchTerm = `%${q}%`;
    const results = [];

    // Search employees
    const employees = await Employee.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { email: { [Op.iLike]: searchTerm } },
          { department: { [Op.iLike]: searchTerm } },
          { position: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 5,
    });
    employees.forEach(e => results.push({
      id: e.id, type: 'Employee', title: e.name,
      subtitle: `${e.department} - ${e.position}`, link: '/employees',
    }));

    // Search courses
    const courses = await Course.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { provider: { [Op.iLike]: searchTerm } },
          { category: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 5,
    });
    courses.forEach(c => results.push({
      id: c.id, type: 'Course', title: c.title,
      subtitle: `${c.provider} - ${c.level}`, link: '/courses',
    }));

    // Search certifications
    const certs = await Certification.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { provider: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 5,
    });
    certs.forEach(c => results.push({
      id: c.id, type: 'Certification', title: c.name,
      subtitle: `${c.provider} - ${c.status}`, link: '/certifications',
    }));

    // Search learning tracks
    const tracks = await LearningTrack.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { category: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 5,
    });
    tracks.forEach(t => results.push({
      id: t.id, type: 'Learning Track', title: t.title,
      subtitle: `${t.category} - ${t.status}`, link: '/tracks',
    }));

    // Search training events
    const events = await TrainingEvent.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { facilitator: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 5,
    });
    events.forEach(e => results.push({
      id: e.id, type: 'Training Event', title: e.title,
      subtitle: `${e.type} - ${e.status}`, link: '/training-events',
    }));

    res.json(results.slice(0, 20));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CSV export
router.get('/export/:resource', auth, async (req, res) => {
  try {
    const { resource } = req.params;
    const modelMap = {
      employees: Employee,
      tracks: LearningTrack,
      'skill-gaps': SkillGap,
      certifications: Certification,
      courses: Course,
      roi: ROIMeasurement,
      'compliance-trainings': ComplianceTraining,
      'training-events': TrainingEvent,
      'learning-budgets': LearningBudget,
      mentorships: MentorshipProgram,
      'performance-reviews': PerformanceReview,
      'competency-frameworks': CompetencyFramework,
      'onboarding-plans': OnboardingPlan,
      'team-goals': TeamGoal,
      'knowledge-base': KnowledgeBase,
      'feedback-surveys': FeedbackSurvey,
      'succession-plans': SuccessionPlan,
      'career-paths': CareerPath,
      'learning-resources': LearningResource,
      'assessment-results': AssessmentResult,
      'wellness-programs': WellnessProgram,
    };

    const Model = modelMap[resource];
    if (!Model) return res.status(404).json({ error: 'Resource not found' });

    const items = await Model.findAll({ raw: true });
    if (items.length === 0) return res.status(200).send('No data');

    // Build CSV
    const headers = Object.keys(items[0]).filter(k => k !== 'createdAt' && k !== 'updatedAt');
    const csvRows = [headers.join(',')];

    items.forEach(item => {
      const row = headers.map(h => {
        let val = item[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') val = JSON.stringify(val);
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(row.join(','));
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${resource}-export.csv`);
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
