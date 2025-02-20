import type { Context, Next } from "hono";
import { verify, decode } from "hono/jwt";
import { PrismaClient } from "@prisma/client";


const SECRET_KEY = Bun.env.JWT_SECRET_KEY; // Replace with env variable

const prisma = new PrismaClient();

export const authMiddleware = async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if(!SECRET_KEY){
        return c.json({error: "Cant find the Secret Key"}, 500);
    }

    if (!authHeader) {
        return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1]; // Extract Bearer <token>
    if (!token) {
        return c.json({ error: "Unauthorized - Invalid token format" }, 401);
    }

    try {
        const decoded = decode(token);

        // Extract the token from the payload
        const payload = decoded?.payload as { token?: string };
        if (!payload?.token) {
            return c.json({ error: "Unauthorized - Invalid token payload ⭕️" }, 401);
        }

        // Step 2: Check if the token exists in the session table
        const session = await prisma.session.findUnique({
            where: { accessToken: token }, // ✅ checking the full JWT
        });


        if (!session) {
            return c.json({ error: "Unauthorized - Session expired or invalid" }, 401);
        }

        // Step 3: Verify the token (Signature Check)
        const verified = await verify(token, SECRET_KEY);
        if (!verified) {
            return c.json({ error: "Unauthorized - Token verification failed" }, 401);
        }

        // Step 4: Attach userId to the request context
        c.set("userId", session.userId);
        await next(); // Move to the next middleware or route handler

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }
};