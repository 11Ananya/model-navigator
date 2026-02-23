import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { createSupabaseClientWithToken } from "../lib/supabase.js";

export const configsRouter = new Hono<{
  Variables: { userId: string; token: string };
}>();

configsRouter.use("*", requireAuth);

configsRouter.get("/", async (c) => {
  const token = c.get("token");
  const client = createSupabaseClientWithToken(token);

  const { data, error } = await client
    .from("saved_configs")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return c.json({ error: "Database error" }, 500);
  return c.json({ configs: data });
});

configsRouter.post("/", async (c) => {
  const token = c.get("token");
  const userId = c.get("userId");
  const client = createSupabaseClientWithToken(token);
  const body = await c.req.json();

  const { data, error } = await client
    .from("saved_configs")
    .insert({ ...body, user_id: userId })
    .select()
    .single();

  if (error?.code === "23505")
    return c.json({ error: "A config with this name already exists" }, 409);
  if (error) return c.json({ error: "Database error" }, 500);
  return c.json({ config: data }, 201);
});

configsRouter.put("/:id", async (c) => {
  const token = c.get("token");
  const client = createSupabaseClientWithToken(token);
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await client
    .from("saved_configs")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (!data) return c.json({ error: "Not found" }, 404);
  if (error) return c.json({ error: "Database error" }, 500);
  return c.json({ config: data });
});

configsRouter.delete("/:id", async (c) => {
  const token = c.get("token");
  const client = createSupabaseClientWithToken(token);
  const id = c.req.param("id");

  const { error, count } = await client
    .from("saved_configs")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) return c.json({ error: "Database error" }, 500);
  if (count === 0) return c.json({ error: "Not found" }, 404);
  return c.json({ success: true });
});
