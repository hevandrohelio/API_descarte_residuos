const BASE_URL = "http://localhost:3000";

window.onload = function () {
    carregarRelatorio();
};

function carregarRelatorio() {
    const url = BASE_URL + "/descarte/relatorio";

    callAPI(url, "GET", function (status, relatorio) {

        if (status !== 200) {
            alert("Erro ao carregar relatório!");
            console.log("Status:", status, "Resposta:", relatorio);
            return;
        }

        console.log("Relatório recebido:", relatorio);
        let content = document.getElementById("content");
        content.innerHTML = "";
        content.innerHTML += criarCard("Ponto mais usado", relatorio.pontoMaisUsado || "N/A");
        content.innerHTML += criarCard("Tipo mais descartado", relatorio.tipoMaisDescartado || "N/A");
        content.innerHTML += criarCard("Média de descartes por dia", relatorio.mediaDescartesPorDia || 0);
        content.innerHTML += criarCard("Total de usuários cadastrados", relatorio.totalUsuarios || 0);
        content.innerHTML += criarCard("Total de pontos de descarte", relatorio.totalPontos || 0);
        content.innerHTML += criarCard("Total geral de descartes", relatorio.totalDescartes || 0);
        content.innerHTML += criarCard("Crescimento mensal (%)", relatorio.crescimentoPercentual + "%" || "0%");
    });
}

function criarCard(titulo, valor) {
    return `
        <div>
            <h2>${titulo}</h2>
            <p><strong>${valor}</strong></p>
        </div>
    `;
}

function callAPI(url, method, callback, data) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(method, url, true);

    if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }

    xhr.onload = function () {
        callback(xhr.status, xhr.response);
    };

    xhr.onerror = function () {
        alert("Erro ao conectar ao servidor.");
    };

    if (data) xhr.send(JSON.stringify(data));
    else xhr.send();
}
