import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevelopersModule } from './developers/developers.module';
import { SkillsModule } from './skills/skills.module';
import { KnowledgeLevelsModule } from './knowledge-levels/knowledge-levels.module';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD') || undefined,
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // solo desarrollo
      }),
    }),
    DevelopersModule,
    SkillsModule,
    KnowledgeLevelsModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
