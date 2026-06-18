// src/auth/data/services/prod.service.ts
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: !isProduction,
      dropSchema: false,
      // ✅ SSL configurado corretamente (sem 'require')
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: !isProduction,
      autoLoadEntities: true,
      extra: {
        max: 20,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        family: 4,
        // ✅ SSL também pode ser configurado aqui
        ssl: {
          rejectUnauthorized: false,
        },
      },
      retryAttempts: 10,
      retryDelay: 3000,
    };
  }
}
