import { Hono } from "hono";
import { serve } from "bun";

import { checkPrismaConnection } from './config/db.ts'
import { registerHandler, loginHandler } from "./routes/publicRoutes.ts";
import { cors } from 'hono/cors'

const app = new Hono();

//CORS middleware to the corsApp instance
const protectedCors = cors({
  origin: ['http://localhost:5173'], 
  allowMethods: ['GET', 'PUT', 'DELETE', 'OPTIONS'], 
  allowHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
});

// public cors
const publicCors = cors({
  origin: ['http://localhost:5173'], 
  allowMethods: ['POST', 'GET', 'OPTIONS'], 
  allowHeaders: ['Content-Type'], 
});

// Mount routes that require CORS
// Create a Hono instance for protected routes
const protectedRoutes = new Hono();
protectedRoutes.use('*', protectedCors); 

// Mount routes that do NOT require CORS

app.use('*',publicCors);

app.get("/", (c) => c.text("Hono!")); 
app.post('/register', registerHandler);
app.post('/login', loginHandler); 

//Env for port
const port = Bun.env.PORT;

async function startServer() {
  try {
    await serve(
      {
        fetch: app.fetch, 
        port: port
      });
    console.log(`Server started on port ${port}`);
    await checkPrismaConnection();
    console.log(`Database Connected Successfully`)
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();