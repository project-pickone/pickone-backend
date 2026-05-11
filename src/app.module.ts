import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from './common/modules/prisma/prisma.service';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { LoginTokenModule } from './common/modules/login-token/login-token.module';
import { BoardModule } from './api/board/board.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
            sqlFlavor: 'postgresql',
          }),
        }),
      ],
    }),
    LoginTokenModule,
    UserModule,
    AuthModule,
    BoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
