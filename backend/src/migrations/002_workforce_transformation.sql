CREATE TABLE IF NOT EXISTS workforce_transformation_records (
  id BIGSERIAL PRIMARY KEY,
  feature_key TEXT NOT NULL CHECK (feature_key IN ('workforce-transformation','job-exposure-redeployment','learning-passport','career-resilience')),
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assess' CHECK (status IN ('assess','plan','execute','verify','complete')),
  risk TEXT NOT NULL DEFAULT 'medium' CHECK (risk IN ('low','medium','high','critical')),
  metric_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  metric_unit TEXT NOT NULL,
  due_date DATE,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (feature_key, title)
);

CREATE INDEX IF NOT EXISTS idx_workforce_transformation_feature_status
  ON workforce_transformation_records(feature_key, status);

WITH feature_seed(feature_key, title_prefix, owner_prefix, metric_unit) AS (
  VALUES
    ('workforce-transformation','Workflow redesign','Transformation Office','hours saved / month'),
    ('job-exposure-redeployment','Role transition','People Analytics','readiness %'),
    ('learning-passport','Verified capability','Learning Operations','evidence items'),
    ('career-resilience','Career experiment','Career Mobility','resilience score')
)
INSERT INTO workforce_transformation_records
  (feature_key,title,owner,status,risk,metric_value,metric_unit,due_date,details)
SELECT
  f.feature_key,
  f.title_prefix || ' ' || LPAD(g::text,2,'0'),
  f.owner_prefix || ' · Pod ' || ((g-1)%5+1),
  (ARRAY['assess','plan','execute','verify','complete'])[((g-1)%5)+1],
  (ARRAY['medium','high','low','medium','critical'])[((g-1)%5)+1],
  CASE f.feature_key
    WHEN 'workforce-transformation' THEN 24 + g * 3
    WHEN 'job-exposure-redeployment' THEN 48 + g * 3
    WHEN 'learning-passport' THEN 3 + g
    ELSE 52 + g * 2
  END,
  f.metric_unit,
  CURRENT_DATE + (g * 5),
  CASE f.feature_key
    WHEN 'workforce-transformation' THEN jsonb_build_object(
      'taskFamily',(ARRAY['customer operations','finance close','quality review','sales operations','content operations'])[((g-1)%5)+1],
      'workMode',(ARRAY['automate','ai-assisted','human-led'])[((g-1)%3)+1],
      'humanControl','Named owner reviews evidence before external action',
      'targetRole','AI-enabled operations specialist')
    WHEN 'job-exposure-redeployment' THEN jsonb_build_object(
      'currentRole',(ARRAY['support analyst','operations coordinator','reporting specialist','content reviewer','scheduler'])[((g-1)%5)+1],
      'destinationRole',(ARRAY['customer success manager','automation supervisor','insights analyst','quality lead','capacity planner'])[((g-1)%5)+1],
      'skillGap',(ARRAY['stakeholder facilitation','workflow design','data storytelling','risk calibration','forecasting'])[((g-1)%5)+1],
      'redeploymentWindowDays',30 + g * 4)
    WHEN 'learning-passport' THEN jsonb_build_object(
      'capability',(ARRAY['agent supervision','critical evaluation','workflow automation','customer discovery','executive communication'])[((g-1)%5)+1],
      'evidenceType',(ARRAY['work sample','simulation','manager attestation','peer review','measured outcome'])[((g-1)%5)+1],
      'verificationState',(ARRAY['submitted','reviewed','verified'])[((g-1)%3)+1],
      'issuer','Enterprise Learning Council')
    ELSE jsonb_build_object(
      'targetRole',(ARRAY['AI operations lead','solutions consultant','product operator','learning architect','customer strategist'])[((g-1)%5)+1],
      'weeklyExperiment',(ARRAY['automate a repeated task','publish an evidence portfolio','shadow a customer call','run a team simulation','build an agent workflow'])[((g-1)%5)+1],
      'mentorCheckIn','Friday',
      'marketSignal','Verified portfolio artifact')
  END
FROM feature_seed f CROSS JOIN generate_series(1,15) g
ON CONFLICT (feature_key,title) DO NOTHING;
