'use server'

import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const data = await request.formData()

  try {
    const subFolder = data.get('subFolder')?.toString() || ''
    if (subFolder) {
      const folderExists = await cloudinary.api.sub_folders(subFolder).catch(() => null)

      if (folderExists) {
        await cloudinary.api.delete_resources_by_prefix(`${subFolder}/`)
        await cloudinary.api.delete_folder(subFolder)
      }
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false })
  }
}
