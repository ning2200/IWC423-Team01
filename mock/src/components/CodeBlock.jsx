import { useState } from 'react'

export default function CodeBlock({ 
  code, 
  language = 'sql', 
  title,
  showLineNumbers = true 
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting
  const highlightSQL = (text) => {
    const keywords = /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|AS|CASE|WHEN|THEN|ELSE|END|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|INSERT|UPDATE|DELETE|CREATE|TABLE|VIEW|INDEX|DROP|ALTER|WITH|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CURRENT_DATE|CURRENT_TIMESTAMP|INTERVAL|IS|NULL|TRUE|FALSE|CROSS|CHECK|CONSTRAINT|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|CASCADE|SET|VALUES|INTO)\b/gi
    const strings = /('[^']*')/g
    const numbers = /\b(\d+\.?\d*)\b/g
    const comments = /(--.*$|\/\*[\s\S]*?\*\/)/gm
    const functions = /\b(COALESCE|NULLIF|CAST|CONVERT|DATE|TIME|TIMESTAMP|EXTRACT|ROUND|FLOOR|CEIL|ABS|LOWER|UPPER|TRIM|SUBSTRING|CONCAT|LENGTH|NOW)\b/gi

    return text
      .replace(comments, '<span class="comment">$1</span>')
      .replace(strings, '<span class="string">$1</span>')
      .replace(keywords, '<span class="keyword">$1</span>')
      .replace(functions, '<span class="function">$1</span>')
      .replace(numbers, '<span class="number">$1</span>')
  }

  const highlightJSON = (text) => {
    const strings = /("(?:[^"\\]|\\.)*")/g
    const numbers = /\b(-?\d+\.?\d*)\b/g
    const booleans = /\b(true|false|null)\b/g
    const keys = /("[\w]+")\s*:/g

    return text
      .replace(keys, '<span class="function">$1</span>:')
      .replace(strings, '<span class="string">$1</span>')
      .replace(numbers, '<span class="number">$1</span>')
      .replace(booleans, '<span class="keyword">$1</span>')
  }

  const highlight = language === 'json' ? highlightJSON : highlightSQL
  const lines = code.trim().split('\n')

  return (
    <div className="rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-300 font-medium">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase">{language}</span>
            <button
              onClick={handleCopy}
              className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-700"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
      <div className="code-block overflow-x-auto">
        <pre className="m-0">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              {showLineNumbers && (
                <span className="select-none text-gray-600 mr-4 text-right w-8">
                  {index + 1}
                </span>
              )}
              <code 
                dangerouslySetInnerHTML={{ __html: highlight(line) || '&nbsp;' }}
              />
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
