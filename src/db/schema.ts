import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: int("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
