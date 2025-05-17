import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

export const db = drizzle(
  postgres(env.DATABASE_URL, {
    max: 1,
    prepare: false,
  }),
  { schema }
);

export function dbQueryStartTime() {
  return sql`select now()`;
}
