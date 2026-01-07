import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid once
let initialized = false

export default function MermaidDiagram({ chart, title }) {
  const containerRef = useRef(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        themeVariables: {
          primaryColor: '#8B1538',
          primaryTextColor: '#333',
          primaryBorderColor: '#5C0E24',
          lineColor: '#A91D3A',
          secondaryColor: '#F5E6E8',
          tertiaryColor: '#fff',
          background: '#ffffff',
          mainBkg: '#F5E6E8',
          secondBkg: '#fff',
          border1: '#8B1538',
          border2: '#A91D3A',
          arrowheadColor: '#8B1538',
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
        },
        er: {
          diagramPadding: 20,
          layoutDirection: 'TB',
          minEntityWidth: 100,
          minEntityHeight: 75,
          entityPadding: 15,
          useMaxWidth: true,
        },
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 15,
          useMaxWidth: true,
        },
      })
      initialized = true
    }
  }, [])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart) return
      
      try {
        // Generate a new unique ID for each render
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err.message || 'Failed to render diagram')
      }
    }
    
    renderDiagram()
  }, [chart])

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-xs text-gray-400">Mermaid Diagram</span>
        </div>
      )}
      <div className="p-6 overflow-x-auto flex justify-center items-center min-h-[300px]">
        {error ? (
          <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
            <p className="font-medium">Error rendering diagram:</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : svg ? (
          <div 
            dangerouslySetInnerHTML={{ __html: svg }}
            className="mermaid-svg"
          />
        ) : (
          <div className="text-gray-400 text-sm">Loading diagram...</div>
        )}
      </div>
    </div>
  )
}
