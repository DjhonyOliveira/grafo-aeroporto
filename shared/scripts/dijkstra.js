/**
 * Monta um grafo a partir da lista de arestas do aeroportos.json.
 * Cada aeroporto passa a apontar diretamente para seus vizinhos, com a distância
 * da ligação entre eles.
 * @param {Array<{from: number, to: number, length: number}>} arestas
 * @returns {Object<string, Object<string, number>>} grafo no formato { idAeroporto: { idVizinho: distancia } }
 */
export function montarGrafo(arestas) {
    const grafo = {};

    for (const aresta of arestas) {
        grafo[aresta.from] ??= {};
        grafo[aresta.to]   ??= {};
        grafo[aresta.from][aresta.to] = aresta.length;
        grafo[aresta.to][aresta.from] = aresta.length;
    }

    return grafo;
}

/**
 * Calcula o menor caminho entre dois aeroportos usando o algoritmo de Dijkstra.
 * @param {Object} grafo grafo de adjacência gerado por montarGrafo()
 * @param {number|string} idOrigem id do aeroporto de partida
 * @param {number|string} idDestino id do aeroporto de chegada
 * @returns {{ distancia: number, caminho: number[] }} distancia total da rota
 * (Infinity quando não existe caminho) e a sequência de ids de aeroportos percorridos,
 * da origem até o destino (caminho vazio quando não existe rota).
 */
export function calcularMenorCaminho(grafo, idOrigem, idDestino) {
    const distancias          = {};
    const aeroportoAnterior   = {};
    const aeroportosPendentes = new Map();

    for (const idAeroporto of Object.keys(grafo)) {
        distancias[idAeroporto]        = Infinity;
        aeroportoAnterior[idAeroporto] = null;

        aeroportosPendentes.set(idAeroporto, Infinity);
    }

    distancias[idOrigem] = 0;
    aeroportosPendentes.set(String(idOrigem), 0);

    while (aeroportosPendentes.size > 0) {
        const idAeroportoAtual = encontrarPendenteMaisProximo(aeroportosPendentes);

        if (idAeroportoAtual === null || idAeroportoAtual === String(idDestino)) {
            break;
        }

        aeroportosPendentes.delete(idAeroportoAtual);

        atualizarDistanciasDosVizinhos({
            grafo,
            idAeroportoAtual,
            distancias,
            aeroportoAnterior,
            aeroportosPendentes
        });
    }

    return {
        distancia: distancias[String(idDestino)],
        caminho: reconstruirCaminho(aeroportoAnterior, idOrigem, idDestino)
    };
}

/**
 * retorna o aeroporto mais próximo da origem
 * @returns {string|null} id do aeroporto mais próximo, ou null se não houver nenhum pendente
 */
function encontrarPendenteMaisProximo(aeroportosPendentes) {
    let idMaisProximo  = null;
    let menorDistancia = Infinity;

    for (const [idAeroporto, distancia] of aeroportosPendentes) {
        if (distancia < menorDistancia) {
            menorDistancia = distancia;
            idMaisProximo  = idAeroporto;
        }
    }

    return idMaisProximo;
}

/**
 * para cada vizinho, verifica se chegar
 * até ele passando pelo aeroporto atual é mais barato do que a melhor rota
 * conhecida até então e, se for, atualiza a distância e o predecessor dele.
 */
function atualizarDistanciasDosVizinhos({ grafo, idAeroportoAtual, distancias, aeroportoAnterior, aeroportosPendentes }) {
    const vizinhos = grafo[idAeroportoAtual] || {};

    for (const [idVizinho, distanciaAteVizinho] of Object.entries(vizinhos)) {
        const distanciaPassandoPeloAtual = distancias[idAeroportoAtual] + distanciaAteVizinho;

        if (distanciaPassandoPeloAtual < distancias[idVizinho]) {
            distancias[idVizinho]        = distanciaPassandoPeloAtual;
            aeroportoAnterior[idVizinho] = idAeroportoAtual;
            aeroportosPendentes.set(idVizinho, distanciaPassandoPeloAtual);
        }
    }
}

/**
 * Percorre os predecessores calculados, do destino até a origem,
 * e monta a sequência de ids de aeroportos na ordem correta de viagem.
 * @returns {number[]} caminho da origem até o destino, ou array vazio se não existir rota
 */
function reconstruirCaminho(aeroportoAnterior, idOrigem, idDestino) {
    const caminho = [];
    let idAtual = String(idDestino);

    const existeRota = aeroportoAnterior[idAtual] !== null || idAtual === String(idOrigem);
    if (!existeRota) {
        return caminho;
    }

    while (idAtual !== null) {
        caminho.unshift(Number(idAtual));
        idAtual = aeroportoAnterior[idAtual];
    }

    return caminho;
}
