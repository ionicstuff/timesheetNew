const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib');

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getTemplatePath() {
  const provided = process.env.INVOICE_TEMPLATE_PATH;
  if (provided && fs.existsSync(provided)) return provided;
  // fallback to a relative template path if user copies it into repo later
  const fallback = path.join(__dirname, '..', 'templates', 'invoice-template.pdf');
  return fallback;
}

function getTemplateConfig() {
  const configPath = path.join(__dirname, '..', 'config', 'invoiceTemplateConfig.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    // default positions (rough). User can calibrate via config/invoiceTemplateConfig.json
    return {
      page: 0,
      fields: {
        invoiceNumber: { x: 430, y: 740, size: 12 },
        issueDate: { x: 430, y: 720, size: 12 },
        dueDate: { x: 430, y: 700, size: 12 },
        clientName: { x: 60, y: 700, size: 12 },
        clientEmail: { x: 60, y: 682, size: 12 },
        projectName: { x: 60, y: 664, size: 12 },
        total: { x: 470, y: 120, size: 14 },
        notes: { x: 60, y: 600, size: 10 },
      },
    };
  }
}

async function generateInvoicePdf(invoiceData, destRelativePath) {
  const templatePath = getTemplatePath();
  const hasTemplate = fs.existsSync(templatePath);

  let pdfDoc;
  let page;

  if (hasTemplate) {
    // Use the provided or fallback template if it exists
    const bytes = fs.readFileSync(templatePath);
    pdfDoc = await PDFDocument.load(bytes);
  } else {
    // No template available: create a simple one-page PDF
    pdfDoc = await PDFDocument.create();
    // A4 size: 595.28 x 841.89 points
    page = pdfDoc.addPage([595.28, 841.89]);
  }

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const cfg = getTemplateConfig();
  // If we loaded a template, use configured page index; otherwise use the page we just created
  if (!page) {
    page = pdfDoc.getPage(cfg.page || 0);
  }

  const draw = (text, pos) => {
    if (!pos) return;
    page.drawText(String(text ?? ''), {
      x: pos.x,
      y: pos.y,
      size: pos.size || 12,
      font,
    });
  };

  // Basic header if we don't have a template (place a title)
  if (!hasTemplate) {
    page.drawText('Invoice', { x: 60, y: 780, size: 18, font });
  }

  draw(invoiceData.invoiceNumber, cfg.fields.invoiceNumber || { x: 430, y: 740, size: 12 });
  draw(invoiceData.issueDate, cfg.fields.issueDate || { x: 430, y: 720, size: 12 });
  draw(invoiceData.dueDate, cfg.fields.dueDate || { x: 430, y: 700, size: 12 });
  draw(invoiceData.clientName, cfg.fields.clientName || { x: 60, y: 700, size: 12 });
  draw(invoiceData.clientEmail, cfg.fields.clientEmail || { x: 60, y: 682, size: 12 });
  draw(invoiceData.projectName, cfg.fields.projectName || { x: 60, y: 664, size: 12 });
  draw((invoiceData.total ?? 0).toFixed(2), cfg.fields.total || { x: 470, y: 120, size: 14 });
  draw(invoiceData.notes || '', cfg.fields.notes || { x: 60, y: 600, size: 10 });

  const outDir = path.join(__dirname, '..', 'uploads', 'invoices');
  await ensureDir(outDir);
  const destFullPath = path.join(outDir, destRelativePath);
  await ensureDir(path.dirname(destFullPath));

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(destFullPath, pdfBytes);

  // return relative path for storage
  const relativePath = path.join('uploads', 'invoices', destRelativePath);
  return { relativePath, fullPath: destFullPath };
}

module.exports = { generateInvoicePdf };
