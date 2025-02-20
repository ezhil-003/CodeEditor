import { z } from 'zod'
import { PrismaClient } from '@prisma/client';
import type { Context } from 'hono';
import { Hono } from "hono";
import { ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {  getViteReactTemplate } from '../utils/getViteTemplate'
import { authMiddleware } from '../middleware/authMiddeware';

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

// Check if S3 is available
async function isS3Available(): Promise<boolean> {
    try {
        await s3Client.send(new ListBucketsCommand({}));
        return true;
    } catch (error) {
        console.error("S3 Connection Failed:", error);
        return false;
    }
}


const createProjectSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    template: z.enum(['vite-react', 'node']).default('vite-react'),
});

userRoutes.post('/createProject', authMiddleware, async (c: Context) => {
    
    const body = await c.req.json();
    console.log(body)
    const result = createProjectSchema.safeParse(body);

    const userId = c.get('userId');
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    if (!result.success) {
        return c.json({ error: result.error.flatten() }, 400);
    }

    // Ensure S3 is connected before proceeding
    const s3Available = await isS3Available();
    if (!s3Available) {
        return c.json({ error: 'S3 service is unavailable. Please try again later.' }, 503);
    }

    try {
        // Create base project
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

        //Create and upload template files
        const templateFiles = getViteReactTemplate(project.id);

        for (const file of templateFiles) {
            await s3Client.send(new PutObjectCommand({
                Bucket: 'my-bucket',
                Key: file.objectKey,
                Body: file.content,
                ContentType: file.contentType,
            }));

            // Prisma insertion 
            await prisma.file.create({
                data: {
                    name: file.name,
                    path: file.path,
                    projectId: project.id,
                    folderId: rootFolder.id,
                    mimeType: file.contentType,
                    size: Buffer.byteLength(file.content),
                    content: file.content.toString(), 
                }
            });
        }

        // Return complete project structure
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

userRoutes.get("/getAllProjects", authMiddleware, async (c:Context) => {
    try {
      const userId = c.get("userId"); // Get user ID from middleware
  
      if (!userId) {
        return c.json({ error: "Unauthorized: No user found" }, 401);
      }
  
      // Fetch projects from database
      const projects = await prisma.project.findMany({
        where: { ownerId: userId },
        orderBy: { updatedAt: "desc" }, // Sort by last updated
      });
  
      return c.json({ success: true, projects }, 200);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });
  


export default userRoutes;

