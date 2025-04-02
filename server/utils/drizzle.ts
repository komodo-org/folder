import { drizzle } from "drizzle-orm/d1";
import schema, { users } from "../database/schema";

export { sql, eq, and, or } from "drizzle-orm";
export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof users.$inferSelect;
