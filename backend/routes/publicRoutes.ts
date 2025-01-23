import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { Hono } from "hono";
import { decode, sign, verify } from 'hono/jwt'
import { randomUUIDv7 } from "bun";


const prisma = new PrismaClient();

const jwtSecret = Bun.env.JWT_SECRET_KEY;

export const registerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const registerSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string(),
      lastName: z.string(),
    });

    const { email, password, firstName, lastName } = registerSchema.parse(body);

    const username = `${firstName} ${lastName}`;

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
    });

    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        username: username
      },
    });

    return c.json({ message: 'User created successfully!' }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: 'Invalid input data.' }, 400);
    }
    console.error('Registration failed:', error);
    return c.json({ message: 'Internal Server Error' }, 500);
  }
};


export const loginHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log("This is to check body",body)
    if(!body){
      return c.json({ message: 'No Data Found' }, 401);
    }

    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const passwordMatch = await Bun.password.verify(password, user.password);

    if (!passwordMatch) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const generateJWT = () => {
      const uniqueUserId = randomUUIDv7(); // Generate a unique identifier
      // Store the uniqueUserId in your database associated with the user
      const payload = { 
        token: uniqueUserId,
        expiresIn: '1h'
      }; 
      const token = sign(payload, `${jwtSecret}`, "HS256"); 
      return token;
    };
    

    // Generate JWT (replace with actual JWT implementation)
    const token = await generateJWT();
    const refreshToken = await generateJWT()

    
    await prisma.session.create({
      data:{
        userId:user.id,
        accessToken:token,
        refreshToken:refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    })

    return c.json({ 
      message: 'Login successful',
      token:token,
      refreshToken:refreshToken
    }, 200);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ message: 'Invalid input data.' }, 400);
    }
    console.error('Login failed:', error);
    return c.json({ message: 'Internal Server Error' }, 500);
  }
};


