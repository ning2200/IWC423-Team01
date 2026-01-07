import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

// Initialize mermaid with custom theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#8B1538',
    primaryTextColor: '#fff',
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
    fontSize: '14px',
    relationColor: '#8B1538',
    relationLabelBackground: '#fff',
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
  },
})

export default function MermaidDiagram({ chart, title }) {
  const containerRef = useRef(null)
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          containerRef.current.innerHTML = ''
          const { svg } = await mermaid.render(uniqueId.current, chart)
          containerRef.current.innerHTML = svg
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          containerRef.current.innerHTML = `<div class="text-red-500 p-4">Error rendering diagram</div>`
        }
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
      <div 
        ref={containerRef} 
        className="p-6 overflow-x-auto flex justify-center items-center min-h-[300px]"
      />
    </div>
  )
}
