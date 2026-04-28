import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AppError, apiErrorResponse } from '@/lib/errors';

const schema = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const exist = await prisma.user.findUnique({ where: { email: body.email } });
    if (exist) throw new AppError('邮箱已存在');
    const hash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { email: body.email, name: body.name, passwordHash: hash, credits: 100 }
    });
    return Response.json({ id: user.id, email: user.email });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
