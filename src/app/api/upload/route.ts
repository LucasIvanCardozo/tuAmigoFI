// src/app/api/upload/route.ts
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
  const file: File | null = data.get('file') as unknown as File;
  const imageId = data.get('id')?.toString() || '';

  if (!file) return NextResponse.json({ success: false });
  if (imageId == '') return NextResponse.json({ success: false });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    console.log('Inicio');
    const upload = await cloudinary.uploader.unsigned_upload(
      `data:image/png;base64,${buffer.toString('base64')}`,
      'ml_default',
      {
        public_id: imageId,
      }
    );
    // const uploadImage = cloudinary.uploader.upload_stream(
    //   {
    //     public_id: imageId,
    //     invalidate: true,
    //     format: 'webp',
    //     quality: 'auto',
    //   },
    //   (error, result) => {
    //     if (error) {
    //       console.error(error);
    //       return NextResponse.json({ success: false, error: error.message });
    //     }
    //     console.log(result);
    //     return NextResponse.json({ success: true, result });
    //   }
    // );
    // const stream = require('stream');
    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(buffer);
    // bufferStream.pipe(uploadImage);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
