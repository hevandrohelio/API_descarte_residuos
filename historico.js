const BASE_URL = "http://localhost:3000";

window.onload = function () {
    carregarPontos();
};

function carregarPontos() {
    const url = BASE_URL + "/descarte/pontos";

    callAPI(url, "GET", function (status, pontos) {
        if (status !== 200) {
            alert("Erro ao carregar pontos");
            return;
        }

        let select = document.getElementById("filtroPonto");

        pontos.forEach(p => {
            let op = document.createElement("option");
            op.value = p._id;
            op.textContent = p.nomeLocal;
            select.appendChild(op);
        });
    });
}

function consultarHistorico() {
    event.preventDefault();

    const url = BASE_URL + "/descarte/historico";

    callAPI(url, "GET", function (status, registros) {
        if (status !== 200) {
            alert("Erro ao consultar histórico");
            return;
        }

        aplicarFiltros(registros);
    });
}

function aplicarFiltros(registros) {

    const nome = document.getElementById("filtroNome").value.trim().toLowerCase();
    const tipo = document.getElementById("filtroTipo").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;
    const pontoId = document.getElementById("filtroPonto").value;

    let filtrados = registros;

    if (nome) {
        filtrados = filtrados.filter(r =>
            r.nomeUsuario.toLowerCase().includes(nome)
        );
    }

    if (tipo) {
        filtrados = filtrados.filter(r =>
            r.tipoResiduo === tipo
        );
    }

    if (pontoId) {
        filtrados = filtrados.filter(r =>
            r.pontoId === pontoId
        );
    }

    if (dataInicio) {
        filtrados = filtrados.filter(r =>
            new Date(r.data) >= new Date(dataInicio + "T00:00:00")
        );
    }

    if (dataFim) {
        filtrados = filtrados.filter(r =>
            new Date(r.data) <= new Date(dataFim + "T23:59:59")
        );
    }

    mostrarResultados(filtrados);
}

function mostrarResultados(lista) {

    let sec = document.getElementById("resultado");
    sec.innerHTML = "";

    if (lista.length === 0) {
        sec.innerHTML = "<p>Nenhum registro encontrado.</p>";
        return;
    }

    lista.forEach(r => {
        sec.innerHTML += `
            <article>
                <h3>${r.nomeUsuario}</h3>
                <ul>
                    <li>Ponto ID: ${r.pontoId}</li>
                    <li>Tipo: ${r.tipoResiduo}</li>
                    <li>Data: ${new Date(r.data).toLocaleDateString()}</li>
                </ul>
            </article>
        `;
    });
}

function callAPI(url, method, callback, data) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(method, url, true);

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }

    xhr.onload = () => callback(xhr.status, xhr.response);
    xhr.onerror = () => alert("Erro ao conectar ao servidor.");

    if (data) xhr.send(JSON.stringify(data));
    else xhr.send();
}
