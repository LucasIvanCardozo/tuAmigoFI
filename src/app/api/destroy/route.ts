'use server';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const id = data.get('id')?.toString() || '';

  try {
    const subFolder = data.get('subFolder')?.toString() || '';
    if (subFolder) {
      const deleteAsset = await cloudinary.uploader.destroy(
        `${subFolder}/${id}`
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
