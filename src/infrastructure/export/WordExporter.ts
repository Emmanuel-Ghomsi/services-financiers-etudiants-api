import { ClientFileDTO } from '@features/clientFile/presentation/dto/ClientFileDTO';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Buffer } from 'buffer';

/**
 * Génère un fichier Word (.docx) à partir de la fiche client
 */
export async function exportClientFileToWord(
  client: ClientFileDTO
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Fiche Client', bold: true, size: 32 }),
            ],
          }),
          ...Object.entries(client).map(
            ([key, value]) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${key}: `, bold: true }),
                  new TextRun(
                    Array.isArray(value)
                      ? value.join(', ')
                      : String(value ?? '')
                  ),
                ],
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
