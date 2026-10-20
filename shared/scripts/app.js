import { options } from './options.js';
import { montarGrafo, calcularMenorCaminho } from './dijkstra.js';

let network, nodes, edges, grafo;
let noSelecionado = null;

async function initGraph() {
    const response = await fetch("aeroportos.json");
    const dadosDoGrafo = await response.json();

    grafo = montarGrafo(dadosDoGrafo.edges);

    nodes = new vis.DataSet(dadosDoGrafo.nodes);
    edges = new vis.DataSet(dadosDoGrafo.edges.map(edge => ({
        id: `${edge.from}-${edge.to}`,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        length: edge.length
    })));

    const container = document.getElementById("network");
    network = new vis.Network(container, { nodes, edges }, options);

    bindEvents();
}

function bindEvents() {
    document.getElementById('fitBtn').onclick = () => network.fit({ animation: true });

    document.getElementById('exportBtn').onclick = () => {
        const canvas  = network.canvas.frame.canvas;
        const dataUrl = canvas.toDataURL('image/png');
        const a       = document.createElement('a');
        a.href = dataUrl;
        a.download = 'grafo-cidades.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    network.on('hoverNode', function() {
        network.body.container.style.cursor = 'pointer';
    });
    network.on('blurNode', function() { 
        network.body.container.style.cursor = 'default'; 
    });

    network.on('click', function(params) {
        const clicado = params.nodes[0];

        if (clicado === undefined || clicado === noSelecionado) {
            nodes.forEach(node => {
                nodes.update({ id: node.id, color: undefined });
            });
            network.unselectAll();
            noSelecionado = null;
            return;
        }

        const connected = network.getConnectedNodes(clicado);

        nodes.forEach(node => {
            nodes.update({ id: node.id, color: undefined });
        });

        connected.forEach(id => {
            nodes.update({ id: id, color: { background:'#cfe9ff' } });
        });

        nodes.update({ id: clicado, color:{ background:'#8ecae6' } });
        noSelecionado = clicado;
    });

    document.getElementById("rotaForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const idOrigem  = document.getElementById("origem").value;
        const idDestino = document.getElementById("destino").value;

        const rotaCalculada = calcularMenorCaminho(grafo, idOrigem, idDestino);
        mostraDistanciaTotalCalculada(rotaCalculada);
        console.log(rotaCalculada);

        edges.forEach(edge => {
            edges.update({ id: edge.id, color: { color: "black" }, width: 1 });
        });

        for (let i = 0; i < rotaCalculada.caminho.length - 1; i++) {
            const idAeroportoAtual   = rotaCalculada.caminho[i];
            const idProximoAeroporto = rotaCalculada.caminho[i + 1];
            const edgeId1 = `${idAeroportoAtual}-${idProximoAeroporto}`;
            const edgeId2 = `${idProximoAeroporto}-${idAeroportoAtual}`;

            if (edges.get(edgeId1)) {
                edges.update({ id: edgeId1, color: { color: "red" }, width: 3 });
            } else if (edges.get(edgeId2)) {
                edges.update({ id: edgeId2, color: { color: "red" }, width: 3 });
            }
        }
    });
}

function mostraDistanciaTotalCalculada(distancia){
    let paragrafoJaExiste = document.querySelector('#distancia p');

    if(paragrafoJaExiste){
        paragrafoJaExiste.remove();
    }

    let p    = document.createElement('p');
    let span = document.getElementById('distancia');

    p.textContent = `distância: ${distancia.distancia} Km`;

    span.append(p);
}

initGraph();