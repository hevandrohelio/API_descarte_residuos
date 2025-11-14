# Sobre o projeto

[HOW TO USE](HOWTOUSE(PT-BR).MD)

Este projeto consiste em uma API desenvolvida com NestJS e MongoDB voltada para o registro e consulta de descartes de resíduos em diferentes pontos de coleta, com o objetivo de promover a conscientização ambiental e o uso responsável dos espaços públicos.

O projeto foi solicitado na Atividade 07 da matéria WebMobile do curso Análise e Desenvolvimento de Sistemas da Universidade Presbiteriana Mackenzie.

A aplicação está alinhada ao Objetivo de Desenvolvimento Sustentável (ODS) 12 da ONU: Consumo e Produção Responsáveis, permitindo o monitoramento dos hábitos de descarte e a análise de dados ambientais de forma simples e estruturada.

## Funcionalidades principais

**Cadastro de pontos de descarte**: permite registrar novos locais com nome, bairro, tipo (público/privado), categoria de resíduos aceitos e geolocalização.

**Registro de descartes**: possibilita que usuários informem descartes realizados, com nome, tipo de resíduo, data e ponto correspondente.

**Consulta de histórico**: permite filtrar registros por usuário, tipo de resíduo, ponto de descarte ou data.

**Dashboard/relatorio**: gera um resumo estatístico em JSON com:

- Local com maior número de descartes;

- Tipo de resíduo mais descartado;

- Média de descartes por dia (últimos 30 dias);

- Total de usuários e pontos cadastrados;

- Percentual de crescimento ou redução em relação ao mês anterior.

## Tecnologias utilizadas

- NestJS (22.19.0) - framework Node.js para construção modular e escalável de APIs RESTful;

- MongoDB + Mongoose - banco de dados não relacional para armazenamento dos registros;

- Postman - ferramenta utilizada para realizar e testar as requisições HTTP.
