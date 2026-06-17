import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';



export async function POST(request: Request) {
  try {
    const { major, scores, province } = await request.json();

    if (!major || scores === undefined || scores === null) {
      return NextResponse.json({ error: 'Thiếu ngành học hoặc điểm thi.' }, { status: 400 });
    }

    const csvPath = path.join(process.cwd(), 'public', 'data_diem_chuan_2025.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');

    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const resultsMap = new Map();
    const searchMajor = major.toLowerCase();
    const searchProvince = (province && province !== 'all') ? province.toLowerCase() : null;

    for (const row of parsed.data as any[]) {
      const rowMajorName = (row['Tên ngành'] || row['Ngành'] || '').toLowerCase();
      const schoolName = (row['Trường đào tạo'] || '').toLowerCase();
      
      // Filter by major name
      if (!rowMajorName.includes(searchMajor)) {
        continue;
      }
      
      // Filter by province
      if (searchProvince) {
        let cleanProvince = searchProvince.split('-').pop()?.trim() || searchProvince;
        cleanProvince = cleanProvince.replace(/^(tỉnh|thành phố)\s+/i, '').trim();
        
        let isMatch = false;
        if (cleanProvince.includes('hồ chí minh') || cleanProvince.includes('hcm')) {
          isMatch = schoolName.includes('hồ chí minh') || schoolName.includes('hcm') || schoolName.includes('sài gòn') || schoolName.includes('tôn đức thắng') || schoolName.includes('hutech') || schoolName.includes('quốc tế');
        } else if (cleanProvince.includes('hà nội')) {
          isMatch = schoolName.includes('hà nội') || schoolName.includes('học viện') || schoolName.includes('kinh tế quốc dân') || schoolName.includes('ngoại thương') || schoolName.includes('mỏ') || schoolName.includes('thương mại');
        } else if (cleanProvince.includes('đà nẵng')) {
          isMatch = schoolName.includes('đà nẵng') || schoolName.includes('duy tân');
        } else {
          isMatch = schoolName.includes(cleanProvince);
        }
        if (!isMatch) {
          continue;
        }
      }

      const loaiDiem = row['Loại điểm'] || '';
      // Filter by standard 30-point scale for simplicity
      if (!loaiDiem.includes('THPTQG') || loaiDiem.includes('40')) {
        continue; // Skip 40-point scale or non-THPT for now
      }

      const block = row['Tổ hợp môn']?.trim();
      const admissionScore = parseFloat(row['Điểm chuẩn']);

      if (!block || isNaN(admissionScore)) continue;

      const userScore = Number(scores);
      if (isNaN(userScore)) continue;

      const diff = userScore - admissionScore;

      const groupKey = `${row['Mã trường']}_${row['Tên ngành'] || row['Ngành']}`;
      const existing = resultsMap.get(groupKey);

      let category = '';
      if (diff >= 2) category = 'safe'; // An toàn
      else if (diff >= -1 && diff < 2) category = 'target'; // Mục tiêu
      else if (diff >= -3 && diff < -1) category = 'dream'; // Ước mơ
      else category = 'no-fit'; // Chống trượt hoặc quá thấp

      if (!existing) {
        resultsMap.set(groupKey, {
          schoolCode: row['Mã trường'],
          schoolName: row['Trường đào tạo'],
          majorName: row['Tên ngành'] || row['Ngành'],
          blocks: [{ name: block, score: Number(admissionScore.toFixed(2)) }],
          admissionScore: Number(admissionScore.toFixed(2)),
          userScore: Number(userScore.toFixed(2)),
          diff: Number(diff.toFixed(2)),
          category,
          note: row['Ghi chú'] || ''
        });
      } else {
        // Prevent duplicate block names
        if (!existing.blocks.some((b: any) => b.name === block)) {
          existing.blocks.push({ name: block, score: Number(admissionScore.toFixed(2)) });
        }
        
        // Update the main diff and category based on the lowest admission score (highest diff)
        if (diff > existing.diff) {
          existing.diff = Number(diff.toFixed(2));
          existing.category = category;
          existing.admissionScore = Number(admissionScore.toFixed(2));
        }
      }
    }

    const groupedData = {
      safe: [] as any[],
      target: [] as any[],
      dream: [] as any[],
      'no-fit': [] as any[]
    };

    for (const item of resultsMap.values()) {
      if (item.category === 'safe') groupedData.safe.push(item);
      else if (item.category === 'target') groupedData.target.push(item);
      else if (item.category === 'dream') groupedData.dream.push(item);
      else groupedData['no-fit'].push(item);
    }

    // Optional: Sort results within categories
    Object.keys(groupedData).forEach(key => {
      groupedData[key as keyof typeof groupedData].sort((a: any, b: any) => b.diff - a.diff);
    });

    return NextResponse.json({ success: true, data: groupedData });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
