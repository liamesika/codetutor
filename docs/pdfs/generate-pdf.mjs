/**
 * PDF Generation Script for CodeTutor Documentation
 *
 * Usage: node docs/pdfs/generate-pdf.mjs
 *
 * This script converts the Markdown documentation to a professionally
 * formatted PDF suitable for institutional review.
 */

import { mdToPdf } from 'md-to-pdf';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generatePDF() {
  const inputPath = join(__dirname, 'CodeTutor_System_Overview_v1.md');
  const outputPath = join(__dirname, 'CodeTutor_System_Overview_v1.pdf');
  const stylePath = join(__dirname, 'styles.css');

  console.log('Reading Markdown source...');
  const markdown = readFileSync(inputPath, 'utf-8');

  console.log('Generating PDF...');

  try {
    const pdf = await mdToPdf(
      { content: markdown },
      {
        dest: outputPath,
        stylesheet: stylePath,
        document_title: 'CodeTutor System Overview',
        pdf_options: {
          format: 'A4',
          margin: {
            top: '25mm',
            right: '20mm',
            bottom: '25mm',
            left: '20mm'
          },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center; color: #666; padding: 10px 20mm;">CodeTutor System Overview - Version 1.0</div>',
          footerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center; color: #666; padding: 10px 20mm;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
        },
        launch_options: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      }
    );

    if (pdf) {
      console.log(`PDF generated successfully: ${outputPath}`);
      console.log(`File size: ${(pdf.content.length / 1024).toFixed(1)} KB`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    process.exit(1);
  }
}

generatePDF();
