import { ServiceContext, UserRole } from '@shared/interface';
import { Router } from 'express';

import { PrismaUserCommandRepository, PrismaUserQueryRepository, PrismaUserRepository } from './infras/repository';
import { UserHTTPService } from './infras/transport';
import { UserUseCase } from './usecase';

export const setupFriendsModule = (sctx: ServiceContext) => {
  const queryRepository = new PrismaUserQueryRepository();
  const commandRepository = new PrismaUserCommandRepository();

  const repository = new PrismaUserRepository(queryRepository, commandRepository);
  const useCase = new UserUseCase(repository);
  const httpService = new UserHTTPService(useCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/friends-request', httpService.registerAPI.bind(httpService));
  router.post('/status-friends-request', httpService.loginAPI.bind(httpService));
  router.post('/delete-friends-request', httpService.profileAPI.bind(httpService));
  router.get('/friends', httpService.profileAPI.bind(httpService));
  router.get('/friends', httpService.profileAPI.bind(httpService));

  router.patch('/profile', httpService.updateProfileAPI.bind(httpService));

  // RPC API (use internally)
  router.post('/rpc/introspect', httpService.introspectAPI.bind(httpService));
  router.post('/rpc/users/list-by-ids', httpService.listByIdsAPI.bind(httpService));
  router.get('/rpc/users/:id', httpService.getByIdAPI.bind(httpService));
  return router;
};