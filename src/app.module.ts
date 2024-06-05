import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { createDropAnonymousTextMessage } from './core/messages/usecases/drop-anonymous-message.usecase';
import { Dependencies, createDependencies } from './core/dependencies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from './core/common/config/config';
import { createGrabMessage } from './core/messages/usecases/grab-message.usecase';


@Module({
  imports: [ConfigModule.forRoot({envFilePath: ['.env.dev', '.env'],})],
  controllers: [AppController],
  providers: [
    {
      provide: "DROP_MESSAGE",
      useFactory: (dependencies : Dependencies)=>{
        return createDropAnonymousTextMessage(dependencies)
      },
      inject: ["DEPENDENCIES"],
    },
    {
      provide: "GRAB_MESSAGE",
      useFactory: (dependencies : Dependencies)=>{
        return createGrabMessage(dependencies)
      },
      inject: ["DEPENDENCIES"],
    },
    {
      provide: "DEPENDENCIES",
      useFactory: (configService: ConfigService<AppConfig>)=>{
        return createDependencies({
          DATABASE_ENCRYPTION_AT_REST: configService.get("DATABASE_ENCRYPTION_AT_REST"),
          DATABASE_NAME: configService.get("DATABASE_NAME"),
          DATABASE_PASSWORD: configService.get("DATABASE_PASSWORD"),
          DATABASE_USER: configService.get("DATABASE_USER"),
          HOST_NAME : configService.get("HOST_NAME"),
        })
      },
      inject: [ConfigService]
    },
  ],
  exports: ["DROP_MESSAGE"]
})
export class AppModule {}
