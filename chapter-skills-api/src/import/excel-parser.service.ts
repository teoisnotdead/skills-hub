import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

const ROW_DEVELOPER_NAMES = 6;
const ROW_ML_LEVELS = 7;
const ROW_DATA_START = 8;
const COL_SKILL_NUMBER = 2;
const COL_SKILL_PRIORITY = 3;
const COL_SKILL_NAME = 4;
const COL_DEVELOPER_START = 11;
const SHEET_NAME = 'Matriz de Competencias';

export interface ParsedDeveloper {
  name: string;
  mlLevel: string | null;
  col: number;
}

export interface ParsedSkill {
  number: number;
  name: string;
  priority: boolean;
  levels: { devName: string; levelName: string }[];
}

export interface ParsedSheet {
  developers: ParsedDeveloper[];
  skills: ParsedSkill[];
  skippedRows: number;
}

@Injectable()
export class ExcelParserService {
  private readonly logger = new Logger(ExcelParserService.name);

  parse(buffer: Buffer): ParsedSheet {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames.find((n) => n === SHEET_NAME) ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    this.logger.log(`Leyendo hoja: "${sheetName}"`);
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    const developers = this.parseDevelopers(rows);
    this.logger.log(`Developers encontrados: ${developers.map((d) => d.name).join(', ')}`);

    const { skills, skippedRows } = this.parseSkills(rows, developers);

    return { developers, skills, skippedRows };
  }

  private parseDevelopers(rows: any[][]): ParsedDeveloper[] {
    const nameRow = rows[ROW_DEVELOPER_NAMES] ?? [];
    const mlRow = rows[ROW_ML_LEVELS] ?? [];
    const developers: ParsedDeveloper[] = [];

    for (let col = COL_DEVELOPER_START; col < nameRow.length; col++) {
      const name = String(nameRow[col] ?? '').trim();
      if (!name) continue;

      const mlRaw = String(mlRow[col] ?? '').trim();
      const mlLevel = mlRaw.replace(/^ML:\s*/i, '').trim() || null;

      // Ignorar columnas placeholder (ej: "Nombre", "Nombre 2") sin ML asignado
      if (name.toLowerCase().startsWith('nombre') && !mlLevel) continue;

      developers.push({ name, mlLevel, col });
    }

    return developers;
  }

  private parseSkills(
    rows: any[][],
    developers: ParsedDeveloper[],
  ): { skills: ParsedSkill[]; skippedRows: number } {
    const skills: ParsedSkill[] = [];
    let skippedRows = 0;

    for (let rowIdx = ROW_DATA_START; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      const skillName = String(row[COL_SKILL_NAME] ?? '').trim();

      if (!skillName) {
        skippedRows++;
        continue;
      }

      const skillNumber = Number(row[COL_SKILL_NUMBER]) || rowIdx - ROW_DATA_START + 1;
      const priorityRaw = String(row[COL_SKILL_PRIORITY] ?? '').trim().toLowerCase();
      const priority = priorityRaw === 'sí' || priorityRaw === 'si';

      const levels: { devName: string; levelName: string }[] = [];
      for (const dev of developers) {
        const cellValue = String(row[dev.col] ?? '').trim();
        if (!cellValue) continue;

        const levelName = cellValue.charAt(0).toUpperCase() + cellValue.slice(1).toLowerCase();
        levels.push({ devName: dev.name, levelName });
      }

      skills.push({ number: skillNumber, name: skillName, priority, levels });
    }

    return { skills, skippedRows };
  }
}
