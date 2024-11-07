import { z } from "zod"

export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(3, 'Permission name must be at least 3 characters')
    .max(50, 'Permission name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_.-:]+$/,
      'Permission name can only contain letters, numbers, and _.-:'
    ),
  groupId: z.number().positive().nullable().optional(),
})

export const updatePermissionSchema = createPermissionSchema.partial()

export const createPermissionGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_.-:]+$/,
      'Group name can only contain letters, numbers, and _.-:'
    ),
})

export const updatePermissionGroupSchema = createPermissionGroupSchema.partial()

export const addPermissionsToGroupSchema = z.object({
  permissionIds: z
    .array(z.number().positive())
    .min(1, 'At least one permission ID must be provided')
    .max(50, 'Cannot add more than 50 permissions at once'),
})

export type CreatePermissionDTO = z.infer<typeof createPermissionSchema>
export type UpdatePermissionDTO = z.infer<typeof updatePermissionSchema>
export type CreatePermissionGroupDTO = z.infer<
  typeof createPermissionGroupSchema
>
export type UpdatePermissionGroupDTO = z.infer<
  typeof updatePermissionGroupSchema
>
export type AddPermissionsToGroupDTO = z.infer<
  typeof addPermissionsToGroupSchema
>
