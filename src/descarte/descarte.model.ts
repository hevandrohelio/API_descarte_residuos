import * as mongoose from 'mongoose';

export const DescarteSchema = new mongoose.Schema({
    nomeUsuario: { type: String, required: true },
    pontoId: { type: String, required: true },
    tipoResiduo: {
        type: String,
        required: true,
        enum: ['plástico', 'papel', 'orgânico', 'eletrônico', 'vidro']
    },
    data: { type: Date, default: Date.now }
})

export const PontoSchema = new mongoose.Schema({
    nomeLocal: { type: String, required: true },
    bairro: { type: String, required: true },
    tipoLocal: { type: String, enum: ['público', 'privado'], required: true },
    categoriasAceitas: [{ type: String, required: true }],
    geolocalizacao: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
});

export interface Descarte extends mongoose.Document {
    id: string;
    nomeUsuario: string;
    pontoId: string;
    tipoResiduo: 'plástico' | 'papel' | 'orgânico' | 'eletrônico' | 'vidro';
    data: Date;
}

export interface Ponto extends mongoose.Document {
    id: string;
    nomeLocal: string;
    bairro: string;
    tipoLocal: 'público' | 'privado';
    categoria: string;
    geolocalizacao: {
        latitude: number;
        longitude: number;
    };
}