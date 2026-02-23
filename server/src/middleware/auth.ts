import { createMiddleware } from "hono/factory";
import { supabaseAdmin } from "../lib/supabase.js";

export const requireAuth = createMiddleware<{
  Variables: { userId: string; token: string };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  c.set("userId", user.id);
  c.set("token", token);
  await next();
});
