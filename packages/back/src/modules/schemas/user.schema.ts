import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const flagsSchema = z.enum([
  "IS_ONBOARDED",
  "IS_ALLOW_PUSH_NOTIFICATION",
  "IS_CANCEL_PUSH_NOTIFICATION",
  "IS_RECOMMEND_APP",
  "IS_ALLOW_GROUP_MESSAGES",
  "IS_JOIN_TO_GROUP",
  "IS_ADD_TO_FAVOURITE",
  "IS_ADD_TO_PROFILE",
]);

const ageSchema = z.literal(0).or(z.number().int().min(9).max(120));

export const userSchema = z.object({
  id: z.number(),
  vkId: z.string().regex(/^\d+$/),
  name: z.string().max(250),
  photo: z.string().optional(),
  age: ageSchema.optional().nullable(),
  profession: z.string().max(35).optional(),
  sex: z.enum(["0", "1", "2"]),
  flags: z.array(flagsSchema),
  isClosedProfile: z.boolean().optional(),
  banned: z.string().nullable().optional(),
  isDon: z.boolean(),
  boost: z.number().int().min(0).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const usersSchema = z.array(userSchema);

const usersQueryStringSchema = z.object({
  vkId: z.string().regex(/^\d+$/).optional(),
});

const createUserSchema = userSchema.pick({
  vkId: true,
  name: true,
  photo: true,
  age: true,
  sex: true,
  isClosedProfile: true,
  banned: true,
});

const patchUserSchema = userSchema
  .pick({
    sex: true,
    age: true,
    profession: true,
    flags: true,
    isDon: true,
    isClosedProfile: true,
    photo: true,
  })
  .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type PatchUserInput = z.infer<typeof patchUserSchema>;
export type QueryStringUsersGet = z.infer<typeof usersQueryStringSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    userSchema,
    usersSchema,
    patchUserSchema,
    usersQueryStringSchema,
  },
  { $id: "userSchemas" }
);
