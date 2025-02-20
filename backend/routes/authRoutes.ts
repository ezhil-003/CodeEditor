import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { Hono } from "hono";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {  getViteReactTemplate } from '../utils/getViteTemplate'

const prisma = new PrismaClient();

const userRoutes = new Hono();

// Configure LocalStack S3 client
const s3Client = new S3Client({
    endpoint: 'http://localhost:4566',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test'
    },
    forcePathStyle: true,
});


const createProjectSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    template: z.enum(['vite-react', 'node']).default('vite-react'),
});

userRoutes.post('/createProject', async (c: Context) => {
    console.log(c.req.json())
    const body = await c.req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
        return c.json({ error: result.error.flatten() }, 400);
    }

    const userId = c.get('userId');
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    try {
        // 1. Create base project
        const project = await prisma.project.create({
            data: {
                name: result.data.name,
                description: result.data.description,
                ownerId: userId,
            }
        });

        // 2. Create root folder
        const rootFolder = await prisma.folder.create({
            data: {
                name: 'root',
                projectId: project.id,
            }
        });

        // 3. Create and upload template files
        const templateFiles = getViteReactTemplate(project.id);

        for (const file of templateFiles) {
            await s3Client.send(new PutObjectCommand({
                Bucket: 'projects',
                Key: file.objectKey,
                Body: file.content,
                ContentType: file.contentType,
            }));

            await prisma.file.create({
                data: {
                    name: file.name,
                    objectKey: file.objectKey,
                    path: file.path,
                    projectId: project.id,
                    folderId: rootFolder.id,
                    mimeType: file.contentType,
                    size: Buffer.byteLength(file.content),
                }
            });
        }

        // 4. Return complete project structure
        const completeProject = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                folders: { include: { files: true } },
            }
        });

        return c.json(completeProject, 201);

    } catch (error) {
        console.error('Project creation failed:', error);
        return c.json({ error: 'Failed to create project' }, 500);
    }
});


export default userRoutes;

