import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const docId = formData.get('docId') as string;

    if (!file || !docId) {
      return NextResponse.json({ error: 'Missing file or docId' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name);
    const safeName = docId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeName}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'docs', 'uploads');
    const filePath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const href = `/docs/uploads/${filename}`;
    return NextResponse.json({ href, filename });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
