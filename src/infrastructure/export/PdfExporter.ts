import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';

/**
 * Génère un fichier PDF à partir de la fiche client
 */
export async function exportClientFileToPDF(
  client: ClientFileDTO
): Promise<Buffer> {
  const templatePath = path.resolve(
    'resources/template/export/client-file-template.html'
  );
  let html = fs.readFileSync(templatePath, 'utf-8');

  Object.entries(client).forEach(([key, value]) => {
    const stringValue = Array.isArray(value)
      ? value.join(', ')
      : String(value ?? '');
    html = html.replaceAll(`{{${key}}}`, stringValue);
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return Buffer.from(pdfBuffer);
}
