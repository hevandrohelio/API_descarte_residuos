const BASE_URL = "http://localhost:3000";

window.onload = function () {
    readAll()
}

function inserirPonto() {
    event.preventDefault();

    const tipoLocalSelecionado = document.querySelector("input[name='tipoLocal']:checked")?.value;

    const categoriasSelecionadas =
        Array.from(document.querySelectorAll("input[type='checkbox']:checked"))
            .map(cb => cb.value);

    let ponto = {
        nomeLocal: document.getElementById('local').value,
        bairro: document.getElementById('bairro').value,
        tipoLocal: tipoLocalSelecionado,
        categoria: categoriasSelecionadas,
        geolocalizacao: {
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value
        }

    }

    const url = BASE_URL + "/descarte/ponto"

    callAPI(url, 'POST', function (status, response) {
        if (status === 200 || status === 201) {
            readAll();
            clear();
        } else {
            alert("ERRO: " + status)
        }
    }, ponto)
}

function criarCartaoPonto(ponto) {
    let str = '<article>';
    str += "<h1>" + ponto.nomeLocal + "</h1><ul>";
    str += "<li>Bairro: " + ponto.bairro + "</li>";
    str += "<li>Tipo: " + ponto.tipoLocal + "</li>";
    str += "<li>Categorias: " + ponto.categoria + "</li>";
    str += "<li>Latitude: " + ponto.geolocalizacao.latitude + "</li>";
    str += "<li>Longitude: " + ponto.geolocalizacao.longitude + "</li></ul>";
    str += `<button onclick="deletePonto('${ponto.nomeLocal}')">Delete</button></article>`;
    return str
}



function deletePonto(nome) {
    console.log('Ativou botão');

    const resp = confirm("Deseja apagar o ponto " + nome + "?");
    console.log(resp);
    if (resp) {
        
        // 1. Buscar pontos
        const url = BASE_URL + "/descarte/pontos";

        callAPI(url, "GET", function (status, pontos) {
            if (status !== 200) {
                alert("Erro ao buscar pontos");
                return;
            }

            // 2. Encontrar ponto pelo nome (case insensitive)
            const ponto = pontos.find(p => p.nomeLocal.toLowerCase() === nome.toLowerCase());

            if (!ponto) {
                alert("Ponto não encontrado!");
                return;
            }

            // 3. Fazer DELETE pelo _id encontrado
            const deleteUrl = BASE_URL + "/descarte/ponto/" + ponto._id;

            callAPI(deleteUrl, "DELETE", function (status, response) {
                if (status === 200) {
                    alert("Ponto removido com sucesso!");
                    readAll();
                } else {
                    alert("Erro ao remover ponto: " + status);
                }
            });
        });
    }
}



function readAll() {
    const url = BASE_URL + "/descarte/pontos";
    callAPI(url, 'GET', function (status, response) {
        if (status === 200) {
            let content = document.getElementById('content');
            content.innerHTML = "";
            for (let i = 0; i < response.length; i++) {
                let str = criarCartaoPonto(response[i]);
                content.innerHTML += str;

            }
        } else {
            alert("erro ao se conectar com o servidor")
        }
    })
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

