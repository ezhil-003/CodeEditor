import { Hono } from "hono";
import { serve } from "bun";
import { checkPrismaConnection } from "./config/db.ts";
import { registerHandler, loginHandler } from "./routes/publicRoutes.ts";
import userRoutes from "./routes/authRoutes.ts";
import { cors } from "hono/cors";

const app = new Hono();

// Global CORS Middleware
app.use('*', (c, next) => {
  const origin = 'http://localhost:5173';
  
  // Public routes (No authentication required)
  if (c.req.path.startsWith('/register') || c.req.path.startsWith('/login')) {
    return cors({ origin, allowMethods: ['POST', 'GET'], allowHeaders: ['Content-Type'] })(c, next);
  }

  // Protected /user routes (Requires Authorization Header)
  if (c.req.path.startsWith('/user')) {
    return cors({
      origin,
      allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    })(c, next);
  }

  return next();
});

// Public routes
app.post('/register', registerHandler);
app.post('/login', loginHandler);

// Mount /user routes
app.route('/user', userRoutes);

// Start Server
const port = Bun.env.PORT || 8000;
async function startServer() {
  try {
    await serve({ fetch: app.fetch, port });
    console.log(`🚀 Server started on port ${port}`);
    await checkPrismaConnection();
    console.log(`✅ Database Connected Successfully`);
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

startServer();