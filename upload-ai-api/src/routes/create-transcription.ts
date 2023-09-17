import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { createReadStream } from 'node:fs';
import { prisma } from '../lib/prisma';

export async function createTranscriptionRoute(app:FastifyInstance) {
    app.post('/videos/:videoID/transcription', async (req) => {

        const paramsSchema = z.object({
            videoID: z.string().uuid(),
        });

        const { videoID } = paramsSchema.parse(req.params);

        const bodySchema = z.object({
            prompt: z.string(),
        });

        const { prompt } = bodySchema.parse(req.body);

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoID,
            }
        });

        const videoPath = video.path;
        const audioReadStream = createReadStream(videoPath);

        

        return {
            videoID,
            prompt,
            videoPath,
        }
    });
}