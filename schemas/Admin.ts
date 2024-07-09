import { z } from 'zod';

// Define a schema for the User ID
const userIdSchema = z.string({
  required_error: 'User ID is required',
  invalid_type_error: 'User ID must be a string'
}).min(5, 'User ID must be at least 5 characters long');

// Define a schema for the Password
const passwordSchema = z.string({
  required_error: 'Password is required',
  invalid_type_error: 'Password must be a string'
}).min(8, 'Password must be at least 8 characters long')
  .regex(/[a-zA-Z0-9]/, 'Password must contain only alphanumeric characters');

// Combine the individual field schemas into a form schema
export const userFormSchema = z.object({
  userId: userIdSchema,
  password: passwordSchema,
});

// Export the schema if you want to use it in another file
export type AdminSchemaType = z.infer<typeof userFormSchema>;
