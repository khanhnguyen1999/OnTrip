import 'module-alias/register';

import { setupUserConsumer, setupUserModule } from '@modules/user/module';
import { config } from '@shared/components/config';
import prisma from '@shared/components/prisma';
import { ServiceContext } from '@shared/interface';
import { responseErr } from '@shared/utils/error';
import Logger from '@shared/utils/logger';
import { TokenIntrospectRPCClient } from '@shared/rpc/verify-token';
import { RedisClient } from '@shared/components/redis-pubsub/redis';
import { NextFunction, Request, Response, static as serveStatic } from 'express';
import { createServer } from 'http';
import path from 'path';
import app from './app';
import { setupMiddlewares } from './shared/middleware';

async function bootServer(port: number) {
  Logger.info(`Starting server in ${config.envName} mode...`);

  try {
    const introspector = new TokenIntrospectRPCClient(config.rpc.introspectUrl);
    const MdlFactory = setupMiddlewares(introspector);

    const connectionUrl = config.redis.url as string;
    await RedisClient.init(connectionUrl);

    await prisma.$connect();
    Logger.success('Prisma connected to database');

    // error handling
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      responseErr(err, res);
      return next();
    });

    const serviceCtx: ServiceContext = {
      mdlFactory: MdlFactory,
      eventPublisher: RedisClient.getInstance(),
    };

    const userModule = setupUserModule(serviceCtx);

    app.use('/v1', userModule);

    app.use('/uploads', serveStatic(path.join(__dirname, '../uploads')));

    // error handling
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      responseErr(err, res);
      return next();
    });

    // setup redis consumer
    setupUserConsumer(serviceCtx);

    const server = createServer(app);

    server.listen(port, () => {
      Logger.success(`Server is running on port ${port}`);
    });
  } catch (e) {
    Logger.error(`Failed to start server: ${(e as Error).message}`);
    process.exit(1);
  }
}

const port = parseInt(config.port);
bootServer(port);