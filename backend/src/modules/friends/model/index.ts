import { UserRole } from "@shared/interface";
import { z } from "zod";
import { ErrFirstNameAtLeast2Chars, ErrLastNameAtLeast2Chars, ErrPasswordAtLeast6Chars, ErrRoleInvalid, ErrUsernameInvalid } from "./error";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum Status {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}


export const friendsSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string().nullable().optional(),
  cover: z.string().nullable().optional(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message),
  username: z
    .string()
    .min(3, "Username must not be less than 3 characters")
    .max(25, "Username must not be greater than 25 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      ErrUsernameInvalid.message,
    ),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  salt: z.string().min(8),
  bio: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  followerCount: z.number().default(0),
  postCount: z.number().default(0),
  role: z.nativeEnum(UserRole, ErrRoleInvalid),
  status: z.nativeEnum(Status).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Friends = z.infer<typeof friendsSchema>;

export const userRegistrationDTOSchema = friendsSchema.pick({
  firstName: true,
  lastName: true,
  username: true,
  password: true,
}).required();

export const userLoginDTOSchema = friendsSchema.pick({
  username: true,
  password: true,
}).required();


export const userUpdateDTOSchema = friendsSchema.pick({
  avatar: true,
  cover: true,
  firstName: true,
  lastName: true,
  password: true,
  bio: true,
  websiteUrl: true,
  salt: true,
  role: true,
  status: true,
}).partial();

