import * as XLSX from "xlsx";

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  isAdmin?: boolean;
  userId?: string;
}

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
) {
  const { fileName = "export.xlsx", sheetName = "Sheet1", isAdmin = false, userId } = options;

  // Jika bukan admin, filter data sesuai user_id
  const filteredData = isAdmin
    ? data
    : data.filter((row) => row.user_id === userId);

  if (filteredData.length === 0) {
    alert("Tidak ada data yang bisa diexport.");
    return;
  }

  // Convert JSON ke worksheet
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Buat file Excel di memory
  const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Buat link untuk download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // Bersihkan object URL setelah selesai
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
