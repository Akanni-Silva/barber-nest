// src/auth/data/services/prod.service.ts
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: !isProduction,
      dropSchema: false,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: !isProduction,
      autoLoadEntities: true,
      extra: {
        max: 20,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
      },
      retryAttempts: 10,
      retryDelay: 3000,
    };
  }
}
