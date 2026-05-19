import React from 'react';
import SkillProgressChart from '../components/SkillProgressChart';
import CourseCompletionHeatmap from '../components/CourseCompletionHeatmap';
import LearningPlanPdf from '../components/LearningPlanPdf';
import LearningPathRulesEditor from '../components/LearningPathRulesEditor';

function CustomViewsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>L&D Views</h1>
      <p style={{ color: '#555' }}>
        Custom learning & development path planning views: visual analytics plus operational tooling.
      </p>
      <SkillProgressChart />
      <CourseCompletionHeatmap />
      <LearningPlanPdf />
      <LearningPathRulesEditor />
    </div>
  );
}

export default CustomViewsPage;
