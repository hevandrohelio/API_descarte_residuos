import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Descarte, Ponto } from './descarte.model';

@Injectable()
export class DescarteService {
  constructor(
    @InjectModel('Ponto') private pontoModel: Model<Ponto>,
    @InjectModel('Descarte') private descarteModel: Model<Descarte>,
  ) {}

  // Cadastrar novo ponto de descarte
  async criarPonto(dados: any) {
    const novo = new this.pontoModel(dados);
    return novo.save();
  }

  // Listar pontos de descarte
  async listarPontos() {
    return this.pontoModel.find().exec();
  }

  // Registrar novo descarte
   async registrarDescarte(data) {
    // Verifica se todas as informações obrigatórias foram enviadas
    const camposObrigatorios = ['nomeUsuario', 'pontoId', 'tipoResiduo', 'data'];
    for (const campo of camposObrigatorios) {
      if (!data[campo] || data[campo].toString().trim() === '') {
        throw new BadRequestException('Preencha todas as informações');
      }
    }

    // Normaliza o tipo de resíduo
    const tipoNormalizado = this.normalizarTipoResiduo(data.tipoResiduo);

    // Verifica se o tipo é válido
    const tiposValidos = ['plástico', 'papel', 'orgânico', 'eletrônico', 'vidro'];
    if (!tiposValidos.includes(tipoNormalizado)) {
      throw new BadRequestException('Forneça um tipo de resíduo válido');
    }

    // Substitui o valor normalizado
    data.tipoResiduo = tipoNormalizado;

    // Salva no banco
    const novoDescarte = new this.descarteModel(data);
    return novoDescarte.save();
  }

  // Função auxiliar de normalização
  private normalizarTipoResiduo(tipo: string): string {
    if (!tipo) return tipo;

    tipo = tipo.trim().toLowerCase();

    const mapa = {
      plastico: 'plástico',
      plástico: 'plástico',
      organico: 'orgânico',
      orgânico: 'orgânico',
      eletronico: 'eletrônico',
      eletrônico: 'eletrônico',
      eletrónico: 'eletrônico',
      papel: 'papel',
      vidro: 'vidro',
    };

    return mapa[tipo] || tipo;
  }

  // Consultar histórico com filtros
  async consultarHistorico(filtros: any) {
    const query: any = {};

    if (filtros.pontoId) query.pontoId = filtros.pontoId;
    if (filtros.tipoResiduo) query.tipoResiduo = filtros.tipoResiduo;
    if (filtros.nomeUsuario) query.nomeUsuario = { $regex: filtros.nomeUsuario, $options: 'i' };

    if (filtros.data) {
      const inicio = new Date(filtros.data);
      const fim = new Date(filtros.data);
      fim.setHours(23, 59, 59, 999);
      query.data = { $gte: inicio, $lte: fim };
    }

    return this.descarteModel.find(query).populate('pontoId').exec();
  }
  // EXCLUIR ponto de descarte por ID
  async deletarPontoPorId(id: string) {
    const ponto = await this.pontoModel.findByIdAndDelete(id);
    if (!ponto) {
      throw new NotFoundException('Ponto de descarte não encontrado');
    }
    return { mensagem: 'Ponto de descarte removido com sucesso' };
  }

  // EXCLUIR descartes por nome de usuário
  async deletarDescartesPorUsuario(nomeUsuario: string) {
    const resultado = await this.descarteModel.deleteMany({ nomeUsuario });
    if (resultado.deletedCount === 0) {
      throw new NotFoundException('Nenhum descarte encontrado para este usuário');
    }
    return { mensagem: `Todos os descartes de ${nomeUsuario} foram removidos` };
  }

  // Dashboard resumo
  async gerarRelatorio() {
    const totalPontos = await this.pontoModel.countDocuments();
    const totalUsuarios = await this.descarteModel.distinct('nomeUsuario').then(u => u.length);
    const totalDescartes = await this.descarteModel.countDocuments();

    // Local mais usado
    const maisUsado = await this.descarteModel.aggregate([
      { $group: { _id: '$pontoId', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    let pontoMaisUsado;
    if (maisUsado.length > 0) {
      const ponto = await this.pontoModel.findById(maisUsado[0]._id);
      pontoMaisUsado = ponto?.nomeLocal ?? 'Desconhecido';
    }

    // Tipo mais descartado
    const tipoMais = await this.descarteModel.aggregate([
      { $group: { _id: '$tipoResiduo', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const tipoMaisDescartado = tipoMais[0]?._id ?? 'N/A';

    // Média de descartes nos últimos 30 dias
    const agora = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(agora.getDate() - 30);

    const ultimos30 = await this.descarteModel.find({
      data: { $gte: trintaDiasAtras, $lte: agora },
    });

    const mediaPorDia = (ultimos30.length / 30).toFixed(2);

    // Crescimento em relação ao mês anterior
    const mesAnteriorInicio = new Date(trintaDiasAtras);
    mesAnteriorInicio.setDate(mesAnteriorInicio.getDate() - 30);
    const mesAnterior = await this.descarteModel.find({
      data: { $gte: mesAnteriorInicio, $lt: trintaDiasAtras },
    });

    const crescimento =
      mesAnterior.length === 0
        ? 100
        : (((ultimos30.length - mesAnterior.length) / mesAnterior.length) * 100).toFixed(1);

    return {
      pontoMaisUsado,
      tipoMaisDescartado,
      mediaDescartesPorDia: Number(mediaPorDia),
      totalUsuarios,
      totalPontos,
      totalDescartes,
      crescimentoPercentual: Number(crescimento),
    };
  }
}
