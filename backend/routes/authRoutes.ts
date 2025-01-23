import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { Hono } from "hono";


const prisma = new PrismaClient();

const userRoutes = new Hono();

