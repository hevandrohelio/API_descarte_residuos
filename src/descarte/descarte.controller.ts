import { Controller, Get, Post, Body, Query, Delete, Param } from '@nestjs/common';
import { DescarteService } from './descarte.service';

@Controller('descarte')
export class DescarteController {
  constructor(private readonly service: DescarteService) {}

  // POST /descarte/ponto
  @Post('ponto')
  async criarPonto(@Body() body: any) {
    return this.service.criarPonto(body);
  }

  // GET /descarte/pontos
  @Get('pontos')
  async listarPontos() {
    return this.service.listarPontos();
  }

  // POST /descarte/registro
  @Post('registro')
  async registrarDescarte(@Body() body: any) {
    return this.service.registrarDescarte(body);
  }

  // GET /descarte/historico?tipoResiduo=plástico&nomeUsuario=João
  @Get('historico')
  async consultar(@Query() query: any) {
    return this.service.consultarHistorico(query);
  }

  // GET /descarte/relatorio
  @Get('relatorio')
  async relatorio() {
    return this.service.gerarRelatorio();
  }
  // Deletar ponto de descarte por ID
  @Delete('ponto/:id')
  async deletarPonto(@Param('id') id: string) {
    return this.service.deletarPontoPorId(id);
  }

  // Deletar descartes de um usuário pelo nome
  @Delete('usuario/:nome')
  async deletarPorUsuario(@Param('nome') nome: string) {
    return this.service.deletarDescartesPorUsuario(nome);
  }
}
