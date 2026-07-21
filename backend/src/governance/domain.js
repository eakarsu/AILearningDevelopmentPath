'use strict';
function evaluate(input = {}) {
  const errors = [], learner = input.learner || {}, goals = input.goals || [], items = input.pathItems || [];
  if (!learner.id || !learner.roleProfileVersion || !learner.consent?.version || !learner.consent?.grantedAt || learner.consent?.revokedAt) errors.push('role profile and active versioned consent required');
  if (!(learner.retentionDays > 0) || learner.retentionDays > 2555) errors.push('bounded retention required');
  const goalIds = new Set(goals.map((g) => String(g.id)));
  for (const goal of goals) if (!goal.id || !goal.metric || !Number.isFinite(Number(goal.baseline)) || !Number.isFinite(Number(goal.target))) errors.push(`goal ${goal.id || '?'} is not measurable`);
  for (const item of items) {
    if (!item.id || !goalIds.has(String(item.goalId)) || !item.contentVersion || !item.rightsBasis || !['not_started','active','completed','blocked'].includes(item.status)) errors.push(`path item ${item.id || '?'} lacks goal, content rights/version, or progress state`);
    if (!item.accessibilityChecked) errors.push(`path item ${item.id || '?'} lacks accessibility review`);
  }
  for (const assessment of input.assessments || []) {
    if (!(assessment.score >= 0 && assessment.score <= 1) || !assessment.rubricVersion || !assessment.evidenceRef) errors.push(`assessment ${assessment.id || '?'} lacks valid evidence/rubric`);
  }
  for (const rec of input.recommendations || []) if (!rec.id || !Array.isArray(rec.reasonCodes) || !rec.reasonCodes.length || !rec.sourceRef || rec.employmentDecision === true) errors.push(`recommendation ${rec.id || '?'} is unexplained or consequential`);
  const appeals = input.appeals || [];
  for (const appeal of appeals) if (!appeal.id || !appeal.ownerId || !['open','corrected','upheld'].includes(appeal.status)) errors.push('appeal/correction path invalid');
  const effectiveness = input.trainingEffectiveness || [];
  for (const measure of effectiveness) if (!measure.interventionVersion || !Number.isFinite(Number(measure.baseline)) || !Number.isFinite(Number(measure.followUp)) || !measure.outcomeMetric) errors.push('training effectiveness measurement incomplete');
  if (!input.approval?.reviewerId || input.approval.reviewerId === learner.id) errors.push('independent human approval required');
  const validation = input.validation || {};
  if (!validation.datasetVersion || !validation.cohortVersion ||
      !(validation.biasDelta >= 0 && validation.biasDelta <= validation.maxBiasDelta) ||
      validation.accessibilityPassRate !== 1 || validation.progressionViolations !== 0 ||
      validation.edgeCasesPassed !== true || !Number.isFinite(Number(validation.outcomeImprovement))) {
    errors.push('versioned bias, accessibility, progression, edge-case, and outcome validation required');
  }
  return { errors, result: { goalCount: goals.length, completed: items.filter((i) => i.status === 'completed').length,
    openAppeals: appeals.filter((a) => a.status === 'open').length,
    effectiveness: effectiveness.map((m) => ({ metric: m.outcomeMetric, change: Number(m.followUp) - Number(m.baseline) })),
    validation,
    decision: errors.length ? 'revise' : 'reviewable' },
    assumptions: ['observed training changes do not prove causal employment outcomes'],
    uncertainty: { biasEvaluationRequired: true, representativeCohortsNotProvided: true, managerOversightRequired: true } };
}
module.exports = { evaluate };
