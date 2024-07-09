import { z } from 'zod';

// Define the schema for the portal entry
export const portalSchema = z.object({
  name: z.string(), // Validates that the name is a string
  id: z.string(),   // Validates that the id is a string
  password: z.string() // Validates that the password is a string
});


export type PortalScehmaType = z.infer<typeof portalSchema>;