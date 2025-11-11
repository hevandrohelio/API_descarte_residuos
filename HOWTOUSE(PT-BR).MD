# Como usar a API

[README](README.md)

## Adaptando o código

Crie um banco de dados MongoDB e, em src\app.module.ts, insira a URL do banco de dados em `MongooseModule.forRoot('URL')`

## Registros

## Criar ponto de descarte

POST <http://localhost:3000/descarte/ponto>

Exemplo:
`{
    "nomeLocal": "Ponto Verde Central",
    "bairro": "Centro",
    "tipoLocal": "público",
    "categoria": "recicláveis",
    "geolocalizacao": { "latitude": -23.55052, "longitude": -46.633308 }
}`

## Registrar descarte

POST <http://localhost:3000/descarte/registro>

Exemplo:
`{ "nomeUsuario": "Hevandro", "pontoId": "ID_DO_PONTO", "tipoResiduo": "plástico", "data": "2025-11-10" }`

## Consultas

### Listar pontos

GET <http://localhost:3000/descarte/pontos>

### Histórico geral

GET <http://localhost:3000/descarte/historico>

### Histórico de usuário

GET <http://localhost:3000/descarte/historico?nomeUsuario=Nome>

### Ver relatório

GET <http://localhost:3000/descarte/relatorio>

## Outros comandos

### Excluir ponto de descarte

DELETE <http://localhost:3000/descarte/ponto/672ef81e4a8f92a5c5db1217>

### Excluir descartes de um usuário

DELETE <http://localhost:3000/descarte/usuario/Hevandro>

ATENÇÃO: Apaga todos os descartes do usuário.
