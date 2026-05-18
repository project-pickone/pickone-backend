import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from './common/modules/prisma/prisma.service';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { LoginTokenModule } from './common/modules/login-token/login-token.module';
import { BoardModule } from './api/board/board.module';
import { CommentModule } from './api/comment/comment.module';
import { VoteModule } from './api/vote/vote.module';
import { FileModule } from './api/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ...(process.env.REACT_BUILD_PATH
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.env.REACT_BUILD_PATH),
            exclude: ['/api/{*path}'],
          }),
        ]
      : []),
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
    VoteModule,
    LoginTokenModule,
    UserModule,
    AuthModule,
    BoardModule,
    CommentModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
