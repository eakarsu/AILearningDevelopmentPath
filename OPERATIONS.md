# Governed learning-development path operations

## Supported local boundary

The production-shaped path is `/api/governed-learning-paths`. It stores versioned role profiles and consent, measurable goals, rights/accessibility-reviewed content, progress, rubric/evidence-backed assessments, explainable non-employment recommendations, appeals/corrections, training-effectiveness measures, representative cohort validation, and human approval.

The generic training-effectiveness gap endpoint is unmounted; its durable replacement is part of the governed work item and immutable event history.

## Fairness, privacy, and oversight

JWT/tenant configuration is mandatory. Learner, manager, instructor, privacy officer, or admin roles may review, but self-approval is denied. Recommendations marked as employment decisions fail validation. Consent, bounded retention, explanation codes, appeal ownership, accessibility, bias threshold, progression checks, and correction paths are required. Export/events are restricted to creator, approver, or admin.

Local metrics do not establish causal training value, fair employment outcomes, or legal compliance. Those determinations remain with qualified organizational reviewers and representative evidence.

## Lifecycle

- `./start.sh check` is a non-mutating configuration check.
- `./start.sh start` uses preinstalled dependencies and never installs, migrates, seeds, kills ports, or starts database services.
- Schema changes require `ALLOW_SCHEMA_MIGRATION=true DATABASE_URL=... ./start.sh migrate`.
- Destructive demo seeding is explicit, prohibited in production, and requires a caller-supplied password.

All generated gap routes are unmounted; generated prototypes are opt-in outside production.

## External systems and failure

LMS, HRIS, ATS, calendar, content, and communications are allow-listed outbox destinations only. A reviewed worker must implement tenant mapping, consent/deletion propagation, cursors, rights, provider idempotency, safe tenants, and receipts. Five failures dead-letter. Real synchronization, candidate/employee use, deletion completion, and outcome/fairness claims fail closed until contracts, credentials, privacy review, representative cohorts, and human oversight are present.

## Verification

Run `node --test backend/src/governance/tests/*.test.js`, changed JavaScript syntax checks, and `bash -n start.sh`. CI covers domain validity, fairness/accessibility fixtures, authorization, migration, canonical idempotency, provider failure, and lifecycle safety without providers, databases, or employment decisions.

