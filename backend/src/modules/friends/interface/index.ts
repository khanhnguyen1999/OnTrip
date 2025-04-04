import { ICommandRepository, IRepository, IUseCase, Requester, TokenPayload } from "@shared/interface";
import { Friends, UserCondDTO, UserLoginDTO, UserRegistrationDTO, UserUpdateDTO } from "../model";

export interface IFriendsUseCase extends IUseCase<FriendsRegistrationDTO, UserUpdateDTO, Friends, UserCondDTO> {
  sendFriendRequest(data: UserLoginDTO): Promise<string>;
  updateStatusFriendRequest(data: UserLoginDTO): Promise<string>;
  removeFriendRequest(data: UserLoginDTO): Promise<string>;
  viewListFriend(data: UserLoginDTO): Promise<string>;
  findFriendsByName(data: UserLoginDTO): Promise<string>;
}
