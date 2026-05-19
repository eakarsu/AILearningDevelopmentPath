# Audit Note — AILearningDevelopmentPath

Source audit: `_AUDIT/reports/batch_05.md` § 7

## Original audit recommendations

### Missing AI endpoints
- `/peer-match-advisor`
- `/succession-planner`
- `/training-effectiveness-analyzer`
- `/budget-optimizer`

### Missing non-AI features
- Manager dashboards
- Peer learning groups
- Mentorship matching & tracking
- Learning effectiveness surveys
- HRIS integration
- Mobile learning app

### Custom feature suggestions
- Agentic career coach
- Real-time skill demand forecasting
- Peer learning matchmaker
- Multi-modal content delivery
- Competitive benchmarking

## Implemented in this pass
1. **POST `/api/ai/peer-match-advisor`** — uses Employee + SkillGap models to recommend mentor / peer matches with structured JSON. Mirrors existing `learning-path` pattern (auto-creates structured output via `parseAIJson`).
2. **POST `/api/ai/training-effectiveness-analyzer`** — assesses LearningTrack + ROIMeasurement records for high/low-impact trainings, structured JSON output.

Both follow the existing route file conventions (auth, aiRateLimiter, Sequelize models, `callOpenRouter`/`parseAIJson`). Syntax checked.

## Backlog (priority order)

### Mechanical
- `/succession-planner` (model query: roles + employee skills)
- `/budget-optimizer` (allocate L&D spend across employees / cohorts)

### Needs product decision
- Manager dashboards (multi-tenant role model)
- Mentorship matching workflow (acceptance, scheduling)
- Effectiveness survey schema

### Needs creds / external SDK
- HRIS sync (Workday, BambooHR)
- Mobile push (APNs/FCM)
- Competitive benchmarking data feed

## Apply pass 3 (frontend)

LEFT-AS-IS. `frontend/src/pages/AIToolsPage.js` already calls the pass-2
endpoints `/ai/peer-match-advisor` and `/ai/training-effectiveness-analyzer`
through `frontend/src/services/api.js`, which injects
`Authorization: Bearer ${localStorage.getItem('token')}` and surfaces
`response.data.error`/`message` so OPENROUTER 503 is shown verbatim. No
FE changes needed.

## Apply pass 4 (mechanical backlog)

LEFT-AS-IS. Both mechanical backlog items are already implemented:
- `POST /api/ai/succession-planner` — `backend/src/routes/ai.js`
  (lines 276-317, with `OPENROUTER_API_KEY` 503 guard) and FE TOOLS entry
  in `frontend/src/pages/AIToolsPage.js`.
- `POST /api/ai/budget-optimizer` — `backend/src/routes/ai.js`
  (lines 320-368, with `OPENROUTER_API_KEY` 503 guard) and FE TOOLS entry
  in `frontend/src/pages/AIToolsPage.js`.

`node --check backend/src/routes/ai.js` re-verified syntax. Remaining
backlog is NEEDS-PRODUCT-DECISION (manager dashboards, mentorship workflow,
survey schema) or NEEDS-CREDS (HRIS sync, push, benchmark feed). No code
changes required this pass.
