import { Module } from '@nestjs/common';
import { DescarteController } from './descarte.controller';
import { DescarteService } from './descarte.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DescarteSchema, PontoSchema } from './descarte.model';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'Descarte', schema: DescarteSchema }, {name: 'Ponto', schema: PontoSchema}])
  ],
  controllers: [DescarteController],
  providers: [DescarteService]
})
export class DescarteModule {}
