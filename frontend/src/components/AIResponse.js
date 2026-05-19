import React from 'react';

function formatAIContent(text) {
  if (!text) return '';
  // Convert markdown-like content to HTML
  let html = text
    .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
    .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
    .replace(/# (.*?)(\n|$)/g, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*?)$/gm, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/gs, (match) => {
      if (!match.startsWith('<ul>') && !match.startsWith('<ol>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    })
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  if (!html.startsWith('<')) html = `<p>${html}</p>`;
  return html;
}

function StructuredLearningPath({ structured }) {
  if (!structured) return null;
  return (
    <div style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'10px',padding:'16px',marginBottom:'16px'}}>
      <div style={{fontSize:'12px',color:'#6366f1',fontWeight:700,marginBottom:'12px'}}>STRUCTURED PLAN PREVIEW</div>
      {structured.timeline_months && (
        <div style={{fontSize:'13px',color:'#94a3b8',marginBottom:'8px'}}>
          Timeline: <strong style={{color:'#e2e8f0'}}>{structured.timeline_months} months</strong>
          {structured.weekly_hours_commitment && <> · <strong style={{color:'#e2e8f0'}}>{structured.weekly_hours_commitment} hrs/week</strong></>}
          {structured.total_budget_estimate && <> · Est. <strong style={{color:'#22c55e'}}>${structured.total_budget_estimate}</strong></>}
        </div>
      )}
      {structured.recommended_courses && structured.recommended_courses.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
          {structured.recommended_courses.map((c, i) => (
            <div key={i} style={{background:'rgba(15,23,42,0.5)',borderRadius:'8px',padding:'8px 12px',fontSize:'13px'}}>
              <span style={{fontWeight:600,color:'#e2e8f0'}}>{c.course_name}</span>
              <span style={{marginLeft:'8px',background:c.priority==='High'?'rgba(239,68,68,0.15)':c.priority==='Low'?'rgba(34,197,94,0.15)':'rgba(59,130,246,0.15)',color:c.priority==='High'?'#ef4444':c.priority==='Low'?'#22c55e':'#3b82f6',borderRadius:'4px',padding:'1px 6px',fontSize:'11px'}}>{c.priority}</span>
              {c.duration_weeks && <span style={{color:'#64748b',marginLeft:'6px',fontSize:'11px'}}>{c.duration_weeks}w</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StructuredROI({ structured }) {
  if (!structured) return null;
  const roiMatch = typeof structured === 'string' ? structured.match(/(\d+(?:\.\d+)?)\s*%/) : null;
  const roiPct = roiMatch ? parseFloat(roiMatch[1]) : null;
  if (!roiPct) return null;
  const color = roiPct >= 100 ? '#22c55e' : roiPct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:`${color}15`,border:`1px solid ${color}30`,borderRadius:'10px',padding:'10px 16px',marginBottom:'16px'}}>
      <span style={{fontSize:'12px',color:'#94a3b8',fontWeight:600}}>PROJECTED ROI</span>
      <span style={{fontSize:'28px',fontWeight:800,color}}>{roiPct}%</span>
    </div>
  );
}

function AIResponse({ data, loading }) {
  if (loading) {
    return (
      <div className="ai-response">
        <div className="ai-loading">
          <div className="spinner"></div>
          Analyzing with AI... This may take a moment.
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Extract ROI percentage from text for roi-prediction type
  const roiMatch = data.type === 'roi-prediction' && data.analysis
    ? data.analysis.match(/(?:predicted|projected|estimated|expected)\s+(?:roi|return)[^\d]*(\d+(?:\.\d+)?)\s*%/i)
    : null;
  const projectedROI = roiMatch ? parseFloat(roiMatch[1]) : null;
  const roiColor = projectedROI >= 100 ? '#22c55e' : projectedROI >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="ai-response">
      <div className="ai-response-header">
        <span className="ai-badge">AI INSIGHT</span>
        <span className="ai-model">{data.model || 'Claude'}</span>
        {data.usage && (
          <span className="ai-tokens">
            {data.usage.prompt_tokens + data.usage.completion_tokens} tokens
          </span>
        )}
      </div>
      {data.employee && (
        <div style={{fontSize: '13px', color: '#94a3b8', marginBottom: '16px'}}>
          Analysis for: <strong style={{color: '#a5b4fc'}}>{data.employee}</strong>
          {data.type && <span style={{marginLeft: '12px', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '4px'}}>{data.type.replace(/-/g, ' ')}</span>}
        </div>
      )}
      {/* Structured Learning Path Preview */}
      {data.type === 'learning-path' && data.structured && (
        <StructuredLearningPath structured={data.structured} />
      )}
      {/* ROI highlight */}
      {projectedROI && (
        <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:`${roiColor}15`,border:`1px solid ${roiColor}30`,borderRadius:'10px',padding:'10px 16px',marginBottom:'16px'}}>
          <span style={{fontSize:'12px',color:'#94a3b8',fontWeight:600}}>PROJECTED ROI</span>
          <span style={{fontSize:'28px',fontWeight:800,color:roiColor}}>{projectedROI}%</span>
        </div>
      )}
      <div className="ai-response-body" dangerouslySetInnerHTML={{ __html: formatAIContent(data.analysis) }} />
    </div>
  );
}

export default AIResponse;
