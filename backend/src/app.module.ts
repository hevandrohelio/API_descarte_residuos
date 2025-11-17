import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DescarteModule } from './descarte/descarte.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DescarteModule, MongooseModule.forRoot('mongodb+srv://hevandro:12345@descarte.crcfsqv.mongodb.net/?appName=Descarte')], // substituir url pela sua
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
