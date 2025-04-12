import { z } from "zod";

const loginSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export default loginSchema;
