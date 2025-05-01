import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function formatValue(value: any): string {
  if (value instanceof Date) {
    return format(value, 'dd/MM/yyyy', { locale: fr });
  }

  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value ?? '';
}

export async function exportClientFileToPDF(
  client: ClientFileDTO
): Promise<Buffer> {
  const templatePath = path.resolve(
    'src/resources/template/export/client-file-template.html'
  );
  let html = fs.readFileSync(templatePath, 'utf-8');

  // Remplacement simple des {{key}} par les valeurs
  Object.entries(client).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, formatValue(value));
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('screen');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    printBackground: true,
  });
  await browser.close();
  return Buffer.from(pdfBuffer);
}
