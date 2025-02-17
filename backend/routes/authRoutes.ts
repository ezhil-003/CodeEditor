import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { Hono } from "hono";


const prisma = new PrismaClient();

const userRoutes = new Hono();

const createProjectSchema = z.object({
    name: z.string().min(3).max(50),
    template: z.enum(['blank', 'react', 'node']).default('blank'),
});


userRoutes.post('/projects', async (c) => {
    const sessionToken = c.req.header('Authorization')?.split(' ')[1];
    if (!sessionToken) return c.json({ error: 'Unauthorized' }, 401);

    // Validate session
    const session = await prisma.postgres.session.findUnique({
        where: { sessionToken },
        include: { user: true },
    });

    if (!session) return c.json({ error: 'Invalid session' }, 401);

    // Validate input
    const body = await c.req.json();
    const result = createProjectSchema.safeParse(body);
    if (!result.success) {
        return c.json({ error: result.error.flatten() }, 400);
    }
    // Create project
    try {
        const project = await prisma.mongodb.project.create({
            data: {
                name: result.data.name,
                ownerId: session.user.id,
                files: {
                    create: getTemplateFiles(result.data.template),
                },
            },
            include: { files: true },
        });

        return c.json(project);
    } catch (error) {
        console.error('Project creation failed:', error);
        return c.json({ error: 'Failed to create project' }, 500);
    }
});

function getTemplateFiles(template: string) {
    const templates: Record<string, any[]> = {
        blank: [{ name: 'index.js', content: '// Start coding!' }],
        react: [
            { name: 'package.json', content: '{ "name": "react-project" }' },
            { name: 'src/App.jsx', content: 'export default function App() { return <div>Hello</div> }' },
        ],
        node: [
            { name: 'package.json', content: '{ "name": "node-project" }' },
            { name: 'index.js', content: 'console.log("Hello World")' },
        ],
    };
    return templates[template];
}