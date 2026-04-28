import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { AppError, apiErrorResponse } from '@/lib/errors';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) throw new AppError('未登录', 401);

    const format = new URL(req.url).searchParams.get('format') ?? 'csv';
    const images = await prisma.generatedImage.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

    const rows = images.map((img: any) => ({
      图片URL: img.imageUrl,
      图片描述: img.imageDescription ?? '',
      IMAGE2提示词: img.image2Prompt,
      LTX2_3提示词: img.ltxPrompt ?? '',
      WAN2_2提示词: img.wanPrompt ?? '',
      创建时间: img.createdAt.toISOString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'images');

    if (format === 'xlsx') {
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return new Response(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } });
    }

    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
