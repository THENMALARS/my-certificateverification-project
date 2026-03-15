const XLSX = require('xlsx');

// Validate Excel file structure and data
const validateExcelData = (filePath) => {
  try {

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }

    /* ================= REQUIRED COLUMNS ================= */

    const requiredColumns = [
      'certificate id',
      'student name',
      'domain',
      'start date',
      'end date',
      'organization name'
    ];

    const firstRow = data[0];

    const headers = Object.keys(firstRow).map(h => h.trim().toLowerCase());

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    /* ================= ROW VALIDATION ================= */

    const errors = [];
    const validData = [];

    data.forEach((row, index) => {

      const rowNumber = index + 2;

      const normalizedRow = {
        certificateId: '',
        studentName: '',
        domain: '',
        startDate: '',
        endDate: '',
        organizationName: ''
      };

      Object.keys(row).forEach(key => {

        const normalizedKey = key.trim().toLowerCase();
        const value = row[key] ? row[key].toString().trim() : '';

        if (normalizedKey === 'certificate id') {
          normalizedRow.certificateId = value;
        }

        if (normalizedKey === 'student name') {
          normalizedRow.studentName = value;
        }

        if (normalizedKey === 'domain') {
          normalizedRow.domain = value;
        }

        if (normalizedKey === 'start date') {
          normalizedRow.startDate = value;
        }

        if (normalizedKey === 'end date') {
          normalizedRow.endDate = value;
        }

        if (normalizedKey === 'organization name') {
          normalizedRow.organizationName = value;
        }

      });

      /* ===== CHECK REQUIRED FIELDS ===== */

      if (!normalizedRow.certificateId) {
        errors.push(`Row ${rowNumber}: Certificate ID is missing`);
      }

      if (!normalizedRow.studentName) {
        errors.push(`Row ${rowNumber}: Student Name is missing`);
      }

      if (!normalizedRow.domain) {
        errors.push(`Row ${rowNumber}: Domain is missing`);
      }

      if (!normalizedRow.startDate) {
        errors.push(`Row ${rowNumber}: Start Date is missing`);
      }

      if (!normalizedRow.endDate) {
        errors.push(`Row ${rowNumber}: End Date is missing`);
      }

      if (!normalizedRow.organizationName) {
        errors.push(`Row ${rowNumber}: Organization Name is missing`);
      }

      /* ===== ADD VALID ROW ===== */

      if (Object.values(normalizedRow).every(val => val)) {
        validData.push(normalizedRow);
      }

    });

    /* ================= DUPLICATE CHECK ================= */

    const certificateIds = validData.map(d => d.certificateId.toUpperCase());

    const duplicates = certificateIds.filter(
      (id, index) => certificateIds.indexOf(id) !== index
    );

    if (duplicates.length > 0) {
      errors.push(
        `Duplicate Certificate IDs found: ${[...new Set(duplicates)].join(', ')}`
      );
    }

    /* ================= RETURN RESULT ================= */

    return {
      isValid: errors.length === 0,
      errors,
      data: validData,
      totalRows: data.length,
      validRows: validData.length
    };

  } catch (error) {

    return {
      isValid: false,
      errors: [error.message],
      data: [],
      totalRows: 0,
      validRows: 0
    };

  }
};

module.exports = { validateExcelData };