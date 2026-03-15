const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateCertificatePDF = async (certificate) => {
  return new Promise(async (resolve, reject) => {
    try {

      console.log("PDF DATA:", certificate);

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificate.certificateId}`,
        {
          width: 150,
          margin: 1,
          color: {
            dark: '#667eea',
            light: '#ffffff'
          }
        }
      );

      const qrBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');

      // Create PDF
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 60, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      /* ================= BORDER ================= */

      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .strokeColor('#667eea')
        .stroke();

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .strokeColor('#764ba2')
        .stroke();

      /* ================= HEADER ================= */

      doc.fontSize(48)
        .fillColor('#667eea')
        .font('Helvetica-Bold')
        .text('CERTIFICATE', { align: 'center' });

      doc.moveDown(0.5);

      doc.fontSize(20)
        .fillColor('#555555')
        .font('Helvetica-Bold')
        .text(`OF INTERNSHIP COMPLETION IN`, { align: 'center' });

      doc.moveDown(0.2);

      doc.fontSize(26)
        .fillColor('#764ba2')
        .font('Helvetica-Bold')
        .text(certificate.organizationName.toUpperCase(), { align: 'center' });

      doc.moveDown(1.5);

      /* ================= BODY ================= */

      doc.fontSize(16)
        .fillColor('#333333')
        .font('Helvetica')
        .text('This is to certify that', { align: 'center' });

      doc.moveDown(0.6);

      doc.fontSize(34)
        .fillColor('#667eea')
        .font('Helvetica-Bold')
        .text(certificate.studentName, {
          align: 'center',
          underline: true
        });

      doc.moveDown(1);

      doc.fontSize(16)
        .fillColor('#333333')
        .font('Helvetica')
        .text('has successfully completed the internship in', {
          align: 'center'
        });

      doc.moveDown(0.4);

      doc.fontSize(24)
        .fillColor('#764ba2')
        .font('Helvetica-Bold')
        .text(certificate.domain, { align: 'center' });

      doc.moveDown(0.8);

      doc.fontSize(14)
        .fillColor('#666666')
        .font('Helvetica')
        .text(
          'This internship was conducted with dedication and professionalism,',
          { align: 'center' }
        );

      doc.text(
        'demonstrating excellent skills and commitment.',
        { align: 'center' }
      );

      /* ================= QR CODE ================= */

      doc.image(qrBuffer, doc.page.width - 180, doc.page.height - 180, {
        width: 120,
        height: 120
      });

      doc.fontSize(10)
        .fillColor('#667eea')
        .font('Helvetica-Bold')
        .text('Scan to Verify', doc.page.width - 180, doc.page.height - 50, {
          width: 120,
          align: 'center'
        });

      /* ================= FOOTER ================= */

      const footerY = doc.page.height - 120;

      doc.fontSize(12)
        .fillColor('#333333')
        .font('Helvetica-Bold')
        .text('Certificate ID:', 60, footerY);

      doc.font('Helvetica')
        .text(certificate.certificateId, 60, footerY + 20);

      doc.font('Helvetica-Bold')
        .text('Start Date:', doc.page.width / 2 - 80, footerY);

      doc.font('Helvetica')
        .text(certificate.startDate, doc.page.width / 2 - 80, footerY + 20);

      doc.font('Helvetica-Bold')
        .text('End Date:', doc.page.width - 380, footerY);

      doc.font('Helvetica')
        .text(certificate.endDate, doc.page.width - 380, footerY + 20);

      /* ================= FINISH ================= */

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateCertificatePDF };