'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'donzj5rlf',
  api_key: '114644541663818',
  api_secret: 'YJ9B-Goy__55LcSFW5Rcayo1bTg',
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const id = data.get('id')?.toString() || '';

  try {
    const subFolder = data.get('subFolder')?.toString() || '';
    if (subFolder == 'problemas') {
      const deleteProblem = await cloudinary.uploader.destroy(
        `parciales/problemas/${id}`
      );
      const deleteResponse = await cloudinary.uploader.destroy(
        `parciales/respuestas/${id}`
      );
    } else {
      const deleteResponse = await cloudinary.uploader.destroy(
        `parciales/respuestas/${id}`
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
