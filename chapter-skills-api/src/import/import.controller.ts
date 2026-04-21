import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as XLSX from 'xlsx';

@Controller('import')
export class ImportController {
  constructor(private readonly service: ImportService) {}

  @Get('debug')
  async debugExcel() {
    const filePath = join(process.cwd(), 'samples', 'Chapter_Front_Matriz_Competencias.xlsx');
    const buffer = readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames.find((n) => n === 'Matriz de Competencias') ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    // Devuelve las primeras 20 filas para analizar la estructura
    return rows.slice(0, 20).map((row, i) => ({ rowIndex: i, cells: row }));
  }

  @Get('sample')
  async importSample() {
    const filePath = join(process.cwd(), 'samples', 'Chapter_Front_Matriz_Competencias.xlsx');
    const buffer = readFileSync(filePath);
    return this.service.importFromBuffer(buffer);
  }

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se envio ningun archivo');
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      throw new BadRequestException('El archivo debe ser .xlsx o .xls');
    }
    return this.service.importFromBuffer(file.buffer);
  }
}
