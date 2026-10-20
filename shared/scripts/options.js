export const options = {
    nodes: {
        shape: 'circle',
        widthConstraint: {
            minimum: 100,
            maximum: 100
        },
        heightConstraint: {
            minimum: 100,
            valign: 'middle'
        },
        font: {
            size: 13,
            face: 'Inter',
            color: '#ffffff'
        }
    },
    edges: {
        width: 2,
        font: { 
            align: 'middle' 
        },
        smooth: { 
            enabled: true, 
            type: 'dynamic' 
        }
    },
    groups: {
        nordeste: {
            color: { background: '#c0392b', border: '#7b241c' }
        },
        norte: {
            color: { background: '#27ae60', border: '#186a3b' }
        },
        centroOeste: {
            color: { background: '#f1c40f', border: '#9a7d0a' },
            font: { color: '#3a2f00' }
        },
        sudeste: {
            color: { background: '#a0522d', border: '#6e3a1e' }
        },
        sul: {
            color: { background: '#2b2bcf', border: '#1a1a8c' }
        }
    },
    physics: {
        stabilization: true,
        barnesHut: {
            gravitationalConstant: -6000,
            springLength: 260,
            avoidOverlap: 1
        }
    },
    interaction: {
        hover: true,
        tooltipDelay: 200,
        dragNodes: true,
        zoomView: true
    }
};