'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../domain');

test('domain workflow accepts a grounded reviewable case', () => {
  const evaluation = evaluate({
  learner: { id: 'l1', roleProfileVersion: 'rp1', consent: { version: 'c1', grantedAt: '2026-01-01' }, retentionDays: 365 },
  goals: [{ id: 'g1', metric: 'assessment', baseline: 0.4, target: 0.8 }],
  pathItems: [{ id: 'i1', goalId: 'g1', contentVersion: 'v1', rightsBasis: 'licensed', status: 'completed', accessibilityChecked: true }],
  assessments: [{ id: 'a1', score: 0.8, rubricVersion: 'r1', evidenceRef: 'work:1' }],
  recommendations: [{ id: 'r1', reasonCodes: ['skill_gap'], sourceRef: 'assessment:a1', employmentDecision: false }],
  appeals: [{ id: 'ap1', ownerId: 'reviewer1', status: 'corrected' }],
  trainingEffectiveness: [{ interventionVersion: 't1', baseline: 0.4, followUp: 0.7, outcomeMetric: 'assessment' }],
  validation: { datasetVersion: 'eval-1', cohortVersion: 'cohort-1', biasDelta: 0.02, maxBiasDelta: 0.05,
    accessibilityPassRate: 1, progressionViolations: 0, edgeCasesPassed: true, outcomeImprovement: 0.3 },
  approval: { reviewerId: 'manager1' }
});
  assert.deepEqual(evaluation.errors, []);
  assert.equal(evaluation.result.decision, 'reviewable');
  assert.ok(Array.isArray(evaluation.assumptions));
  assert.equal(typeof evaluation.uncertainty, 'object');
});

test('domain workflow fails closed on incomplete or unsafe input', () => {
  const evaluation = evaluate({ learner: { id: 'l1', consent: {}, retentionDays: 9999 }, goals: [], pathItems: [], recommendations: [{ id: 'r', employmentDecision: true }], approval: { reviewerId: 'l1' } });
  assert.ok(evaluation.errors.length > 0);
  assert.notEqual(evaluation.result.decision, 'reviewable');
});
