'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: 'donzj5rlf',
  api_key: '114644541663818',
  api_secret: 'YJ9B-Goy__55LcSFW5Rcayo1bTg',
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const id = data.get('id')?.toString() || '';

  if (!file || id == '') return NextResponse.json({ success: false });

  const type = file.type.split('/').reverse()[0];
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const subFolder = data.get('subFolder')?.toString() || '';
  try {
    if (type == 'pdf') {
      const upload: UploadApiResponse =
        await cloudinary.uploader.unsigned_upload(
          `data:application/${type};base64,${buffer.toString('base64')}`,
          'ml_default',
          {
            public_id: id,
            folder: subFolder,
          }
        );
    } else {
      const upload = await cloudinary.uploader.unsigned_upload(
        `data:image/${type};base64,${buffer.toString('base64')}`,
        'ml_default',
        {
          public_id: id,
          folder: subFolder,
        }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
