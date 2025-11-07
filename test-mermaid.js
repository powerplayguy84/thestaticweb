const fs = require('fs');
const path = require('path');

// Simple test to see what HTML is generated
const testHtml = `<pre><code class="language-mermaid">flowchart TD
    A[Start] --> B[End]</code></pre>`;

console.log('Input HTML:', testHtml);

const result = testHtml.replace(
  /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
  (match, mermaidCode) => {
    console.log('Matched code:', mermaidCode);
    const decodedCode = mermaidCode
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return `<div class="mermaid">${decodedCode}</div>`;
  }
);

console.log('Output HTML:', result);
