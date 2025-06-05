import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
export const PORT = env.PORT;
