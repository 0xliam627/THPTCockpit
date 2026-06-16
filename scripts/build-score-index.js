const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const DATA_DIR = path.join(__dirname, '..', 'diem_thi_2025');
const OUT_DIR = path.join(DATA_DIR, 'index');
const DATA_FILES = ['20250715-ketquathi-ct2018a.xlsx', '20250715-ketquathi-ct2006.xlsx'];
const SBD_KEYS = ['sbd', 'so bao danh', 'số báo danh', 'sobao danh', 'sobd', 'so_bd', 'soBaoDanh'];

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeSbd(value) {
  return String(value ?? '')
    .trim()
    .replace(/\.0$/, '')
    .replace(/\s+/g, '');
}

function findSbdInRow(row) {
  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalize(key);
    if (SBD_KEYS.some((candidate) => normalizedKey.includes(normalize(candidate)))) {
      const normalizedValue = normalizeSbd(value);
      if (normalizedValue) return normalizedValue;
    }
  }

  for (const value of Object.values(row)) {
    const normalizedValue = normalizeSbd(value);
    if (/^\d{6,12}$/.test(normalizedValue)) return normalizedValue;
  }

  return null;
}

function buildPartitionIndex() {
  console.log('Bắt đầu khởi tạo bộ chỉ mục điểm thi 2025...');
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Khởi tạo 100 part rỗng
  const partitions = Array.from({ length: 100 }, () => ({}));

  for (const fileName of DATA_FILES) {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`Bỏ qua file không tồn tại: ${fileName}`);
      continue;
    }

    console.log(`Đang đọc file: ${fileName}...`);
    const workbook = XLSX.readFile(filePath, { cellDates: false });

    for (const sheetName of workbook.SheetNames) {
      console.log(`Đang parse sheet: ${sheetName}...`);
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });

      console.log(`Tìm thấy ${rows.length} hàng. Đang phân vùng dữ liệu...`);
      for (const row of rows) {
        const sbd = findSbdInRow(row);
        if (sbd) {
          // Lấy 2 chữ số cuối cùng của SBD làm khoá phân vùng (ví dụ: SBD 66006423 -> partition 23)
          const partKey = sbd.slice(-2).padStart(2, '0');
          const partIndex = parseInt(partKey, 10);
          if (partIndex >= 0 && partIndex < 100) {
            if (!partitions[partIndex][sbd]) {
              partitions[partIndex][sbd] = {
                sourceFile: fileName,
                sheetName,
                row,
              };
            }
          }
        }
      }
    }
  }

  console.log('Ghi dữ liệu phân vùng ra các file JSON...');
  for (let i = 0; i < 100; i++) {
    const partName = String(i).padStart(2, '0');
    const outPath = path.join(OUT_DIR, `${partName}.json`);
    fs.writeFileSync(outPath, JSON.stringify(partitions[i], null, 2), 'utf8');
  }

  console.log('Khởi tạo bộ chỉ mục điểm thi 2025 thành công!');
}

buildPartitionIndex();
