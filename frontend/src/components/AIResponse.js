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
      <div className="ai-response-body" dangerouslySetInnerHTML={{ __html: formatAIContent(data.analysis) }} />
    </div>
  );
}

export default AIResponse;
