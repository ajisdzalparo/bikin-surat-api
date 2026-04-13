import fs from 'fs/promises';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph } from 'docx';

export class ExportService {
	private readonly outputDir = path.join(process.cwd(), 'storage', 'documents');

	private async ensureOutputDir() {
		await fs.mkdir(this.outputDir, { recursive: true });
	}

	async generatePdf(filenameBase: string, content: string) {
		await this.ensureOutputDir();
		const filePath = path.join(this.outputDir, `${filenameBase}.pdf`);
		const doc = new PDFDocument();
		const stream = doc.pipe((await import('fs')).createWriteStream(filePath));
		doc.fontSize(12).text(content);
		doc.end();
		await new Promise<void>((resolve, reject) => {
			stream.on('finish', () => resolve());
			stream.on('error', reject);
		});
		return filePath;
	}

	async generateDocx(filenameBase: string, content: string) {
		await this.ensureOutputDir();
		const filePath = path.join(this.outputDir, `${filenameBase}.docx`);
		const doc = new Document({
			sections: [
				{
					children: [new Paragraph(content)],
				},
			],
		});
		const buffer = await Packer.toBuffer(doc);
		await fs.writeFile(filePath, buffer);
		return filePath;
	}
}
