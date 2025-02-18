import { z } from 'zod'

export const CreatePermissionSchema = z.object({
  key: z.string().min(3, 'Permission name must be at least 3 characters'),
  name: z.string().min(1),
  description: z.string().optional(),
  groupId: z.number().optional(),
})

export const UpdatePermissionSchema = CreatePermissionSchema.partial()

export const CreateGroupSchema = z.object({
  name: z
    .string()
    .min(3, 'Group name must be at least 3 characters')
    .max(50, 'Group name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_.-:]+$/,
      'Group name can only contain letters, numbers, and _.-:',
    ),
  description: z.string().optional(),
})

export const AddPermissionToGroup = z.object({
  permissionIds: z
    .array(z.number().positive())
    .min(1, 'At least one permission ID must be provided')
    .max(50, 'Cannot add more than 50 permissions at once'),
})

export type CreatePermission = z.infer<typeof CreatePermissionSchema>
export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>
export type CreateGroup = z.infer<typeof CreateGroupSchema>
export type AddPermissionToGroup = z.infer<typeof AddPermissionToGroup>
