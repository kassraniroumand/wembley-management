import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
});

export type RequestRequest = z.infer<typeof registerSchema>;

export default registerSchema;
