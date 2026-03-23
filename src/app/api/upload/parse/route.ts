import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Papa from "papaparse";

/**
 * Parse uploaded file (CSV or Excel) and return rows as JSON.
 * Column mapping is applied client-side or in a separate step.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase();

  let rows: Record<string, unknown>[] = [];

  if (ext === "csv") {
    const text = buf.toString("utf-8");
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    rows = parsed.data;
  } else if (["xlsx", "xls"].includes(ext ?? "")) {
    const wb = XLSX.read(buf, { type: "buffer" });
    const first = wb.SheetNames[0];
    if (!first) {
      return NextResponse.json({ error: "No sheets in workbook" }, { status: 400 });
    }
    const ws = wb.Sheets[first];
    rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
  } else {
    return NextResponse.json(
      { error: "Unsupported format. Use CSV or Excel." },
      { status: 400 }
    );
  }

  const columns = rows.length > 0 ? Object.keys(rows[0] as object) : [];
  return NextResponse.json({
    rows,
    columns,
    rowCount: rows.length,
  });
}
