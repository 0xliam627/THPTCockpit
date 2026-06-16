import { NextResponse } from 'next/server';
import Papa from 'papaparse';

export const revalidate = 3600; // Cache for 1 hour

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1OR-rOP1ScpDp1RSMwwvMIpIu5Q4a5QTwMDzQNpqBQDc/gviz/tq?tqx=out:csv&gid=384713546';

export async function GET() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch spreadsheet');
    }
    const csvText = await response.text();

    const result = Papa.parse<string[]>(csvText, {
      skipEmptyLines: true,
      header: false,
    });

    const data = result.data;
    if (data.length < 2) {
      return NextResponse.json({ data: [] });
    }

    // Skip the first two rows (metadata and header)
    const rows = data.slice(2);

    const minhChungList: any[] = [];
    let currentRegion = 'Khu vực Miền Nam';

    for (const row of rows) {
      const schoolName = row[0] || '';
      const admissionInfo = row[3] || '';

      // Update region if row is a header
      if (schoolName.includes('✅') || schoolName.toLowerCase().includes('khu vực')) {
        currentRegion = schoolName.replace('✅', '').replace(/-+$/, '').trim();
        continue;
      }

      if (schoolName.trim() === '' || admissionInfo.trim() === '') {
        continue;
      }

      const admissionRules = row[3] || '';
      let registrationLink = row[4] || null;
      if (!registrationLink) {
        const urlMatch = admissionRules.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          registrationLink = urlMatch[0];
        }
      }

      minhChungList.push({
        schoolName: row[0] || 'Chưa rõ',
        code: row[1] || '-',
        tuition: row[2] || '-',
        admissionRules,
        registrationLink,
        fanpageLink: row[5] || null,
        admissionPlanLink: row[6] || null,
        guideLink: row[7] || null,
        note: row[9] || null,
        region: currentRegion,
      });
    }

    return NextResponse.json({ data: minhChungList });
  } catch (error: any) {
    console.error('Error fetching minh chung data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
