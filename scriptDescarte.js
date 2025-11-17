const BASE_URL = "http://localhost:3000";

window.onload = function () {
    readAll()
}

function inserirUsuario() {
    event.preventDefault();

    const nomePonto = document.getElementById("nomePonto").value.trim();
    const nomeUsuario = document.getElementById("nomeUsuario").value.trim();

    const tipoSelecionado = document.querySelector("input[name='tipoResiduo']:checked")?.value;

    if (!tipoSelecionado) {
        alert("Selecione um tipo de resíduo!");
        return;
    }

    console.log("TIPO:", tipoSelecionado);

    const dataInput = document.getElementById("data").value;
    const dataCorreta = dataInput + "T12:00:00"; // meio-dia = nunca muda o dia

    // 1. Buscar pontos pelo nome
    const urlPontos = BASE_URL + "/descarte/pontos";

    callAPI(urlPontos, "GET", function (status, pontos) {
        if (status !== 200) {
            alert("Erro ao buscar pontos");
            return;
        }

        const pontoEncontrado = pontos.find(
            p => p.nomeLocal.toLowerCase() === nomePonto.toLowerCase()
        );

        if (!pontoEncontrado) {
            alert("Ponto não encontrado");
            return;
        }

        // 2. Montar objeto com ID correto
        const usuario = {
            nomeUsuario: nomeUsuario,
            pontoId: pontoEncontrado._id,
            tipoResiduo: tipoSelecionado,
            data: dataCorreta
        };

        const urlRegistro = BASE_URL + "/descarte/registro";

        // 3. Enviar para a API
        callAPI(urlRegistro, "POST", function (status, response) {
            if (status === 200 || status === 201) {
                alert("Registro criado!");
                readAll();
            } else {
                alert("Erro ao criar registro");
            }
        }, usuario);
    });
}


function criarCartaoUsuario(usuario, mapaPontos) {

    const nomePonto = mapaPontos[usuario.pontoId] || "(Nome não encontrado)";

    let str = "<article>";
    str += `<h1>${usuario.nomeUsuario}</h1><ul>`;
    str += `<li>Ponto: ${nomePonto}</li>`;
    str += `<li>Ponto ID: ${usuario.pontoId}</li>`;
    str += `<li>Tipo: ${usuario.tipoResiduo}</li>`;
    str += `<li>Data: ${new Date(usuario.data).toLocaleDateString()}</li></ul>`;
    str += `<button onclick="deleteUsuario('${usuario.nomeUsuario}')">Delete</button>`;
    str += "</article>";

    return str;
}





function deleteUsuario(nome) {
    const resp = confirm("Deseja apagar o registro de " + nome + "?");

    if (!resp) return;

    const url = BASE_URL + "/descarte/historico";

    callAPI(url, "GET", function (status, registros) {
        if (status !== 200) {
            alert("Erro ao buscar registros");
            return;
        }

        const registro = registros.find(
            r => r.nomeUsuario.toLowerCase() === nome.toLowerCase()
        );

        if (!registro) {
            alert("Registro não encontrado");
            return;
        }

        const deleteUrl = BASE_URL + "/descarte/usuario/" + nome;

        callAPI(deleteUrl, "DELETE", function (status, response) {
            if (status === 200) {
                alert("Registro removido!");
                readAll();
            } else {
                alert("Erro ao remover: " + status);
            }
        });
    });
}




function readAll() {
    const urlHistorico = BASE_URL + "/descarte/historico";
    const urlPontos = BASE_URL + "/descarte/pontos";

    // Primeiro buscar todos os pontos
    callAPI(urlPontos, "GET", function (statusPontos, pontos) {

        if (statusPontos !== 200) {
            alert("Erro ao buscar pontos");
            return;
        }

        // Criar mapa ID → Nome
        const mapaPontos = {};
        pontos.forEach(p => mapaPontos[p._id] = p.nomeLocal);

        // Agora buscar o histórico
        callAPI(urlHistorico, "GET", function (statusHist, historico) {

            if (statusHist !== 200) {
                alert("Erro ao buscar registros");
                return;
            }

            let content = document.getElementById('content');
            content.innerHTML = "";

            historico.forEach(usuario => {
                let str = criarCartaoUsuario(usuario, mapaPontos);
                content.innerHTML += str;
            });

        });

    });
}




function callAPI(url, method, callback, data) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open(method, url, true);
    if (method == 'POST' || method == 'PATCH' || method == 'PUT') {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
    }
    xhr.onload = function () {
        let status = xhr.status;
        callback(status, xhr.response);
    };
    xhr.onerror = function () {
        alert("Erro ao conectar com o servidor.");
    };

    if (data) {
        xhr.send(JSON.stringify(data))
    }
    else {
        xhr.send();
    }
}

