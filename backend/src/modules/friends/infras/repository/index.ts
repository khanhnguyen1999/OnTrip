import { IUserCommandRepository } from "@modules/user/interface";
import { Friends, FriendsCondDTO, FriendsUpdateDTO, UserUpdateDTO } from "@modules/friends/model";
import prisma from "@shared/components/prisma";
import { ICommandRepository, IQueryRepository, IRepository } from "@shared/interface";
import { Paginated, PagingDTO } from "@shared/model";

export class PrismaFriendsRepository implements IRepository<Friends, FriendsCondDTO, FriendsUpdateDTO> {
  constructor(
    private readonly queryRepository: IQueryRepository<Friends, FriendsCondDTO>,
    private readonly commandRepository: ICommandRepository<Friends, FriendsUpdateDTO>
  ) {}

  async findById(id: string): Promise<Friends | null> {
    return await this.queryRepository.findById(id);
  }

//   async findByCond(condition: UserCondDTO): Promise<User | null> {
//     return await this.queryRepository.findByCond(condition);
//   }

//   async list(cond: UserCondDTO, paging: PagingDTO): Promise<Paginated<User>> {
//     return await this.queryRepository.list(cond, paging);
//   }

//   async listByIds(ids: string[]): Promise<User[]> {
//     return await this.queryRepository.listByIds(ids);
//   }

//   async insert(data: User): Promise<boolean> {
//     return await this.commandRepository.insert(data);
//   }

//   async update(id: string, data: UserUpdateDTO): Promise<boolean> {
//     return await this.commandRepository.update(id, data);
//   }

//   async delete(id: string, isHard: boolean): Promise<boolean> {
//     return await this.commandRepository.delete(id, isHard);
//   }  
}

export class PrismaFriendsCommandRepository implements IFriendsCommandRepository {

  async incrementCount(id: string, field: string, step: number): Promise<boolean> {
    await prisma.users.update({ where: { id }, data: { [field]: { increment: step } } });
    return true;
  }

  async decrementCount(id: string, field: string, step: number): Promise<boolean> {
    await prisma.users.update({ where: { id }, data: { [field]: { decrement: step } } });
    return true;
  }

  async insert(data: User): Promise<boolean> {
    await prisma.users.create({ data });
    return true;
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    await prisma.users.update({ where: { id }, data });
    return true;
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    isHard ? 
      await prisma.users.delete({ where: { id } }) 
      : await prisma.users.update({ where: { id }, data: { status: 'deleted' } })

    return true;
  }
}


export class PrismaFriendsQueryRepository implements IQueryRepository<Friends, FriendsCondDTO> {
//   async findById(id: string): Promise<User | null> {
//     const data = await prisma.users.findUnique({ where: { id } });
//     if (!data) return null;

//     return { ...data, role: data.role as UserRole } as User;
//   }
  
//   async findByCond(condition: UserCondDTO): Promise<User | null> {
//     const data = await prisma.users.findFirst({ where: condition });
//     if (!data) return null;

//     return { ...data, role: data.role as UserRole } as User;
//   }
  
//   async list(cond: UserCondDTO, paging: PagingDTO): Promise<Paginated<User>> {
//     const condition = { ...cond, not: { status: 'deleted' } };
//     const total = await prisma.users.count({ where: condition });

//     const skip = (paging.page - 1) * paging.limit;

//     const items = await prisma.users.findMany({
//       where: condition,
//       take: paging.limit,
//       skip,
//       orderBy: { createdAt: 'desc' }
//     });

//     return {
//       data: items.map((item: any) => ({ ...item, role: item.role as UserRole }) as User),
//       paging,
//       total
//     }
//   }

//   async listByIds(ids: string[]): Promise<User[]> {
//     const data = await prisma.users.findMany({ where: { id: { in: ids } } });
//     return data.map((item: any) => ({ ...item, role: item.role as UserRole }) as User);
//   }
}