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

  try {
    const subFolder = data.get('subFolder')?.toString() || '';
    if (subFolder) {
      const folderExists = await cloudinary.api
        .sub_folders(subFolder)
        .catch(() => null);
        
      if (folderExists) {
        await cloudinary.api.delete_resources_by_prefix(`${subFolder}/`);
        await cloudinary.api.delete_folder(subFolder);
      }
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false });
  }
}
