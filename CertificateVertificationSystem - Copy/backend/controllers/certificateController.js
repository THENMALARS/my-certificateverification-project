const Certificate = require('../models/Certificate');
const { validateExcelData } = require('../utils/excelValidator');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

// @desc    Upload bulk certificates via Excel
// @route   POST /api/certificates/upload
// @access  Private/Admin
exports.uploadCertificates = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an Excel file'
      });
    }

    const filePath = req.file.path;

    // Validate Excel data
    const validation = validateExcelData(filePath);

    if (!validation.isValid) {
      // Delete uploaded file
      fs.unlinkSync(filePath);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid Excel data',
        errors: validation.errors
      });
    }

    // Check for duplicate certificate IDs in database
    const certificateIds = validation.data.map(d => d.certificateId.toUpperCase());
    const existingCerts = await Certificate.find({
      certificateId: { $in: certificateIds }
    });

    if (existingCerts.length > 0) {
      const duplicateIds = existingCerts.map(c => c.certificateId);
      fs.unlinkSync(filePath);
      
      return res.status(400).json({
        success: false,
        message: 'Duplicate certificate IDs found in database',
        duplicates: duplicateIds
      });
    }

    // Insert certificates
    const certificates = validation.data.map(cert => ({
      ...cert,
      certificateId: cert.certificateId.toUpperCase(),
      uploadedBy: req.user.id
    }));

    const insertedCerts = await Certificate.insertMany(certificates);

    // Delete uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${insertedCerts.length} certificates`,
      data: {
        totalUploaded: insertedCerts.length,
        certificates: insertedCerts
      }
    });

  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private/Admin
exports.getCertificates = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (req.query.domain) {
      query.domain = new RegExp(req.query.domain, 'i');
    }
    
    if (req.query.search) {
      query.$or = [
        { certificateId: new RegExp(req.query.search, 'i') },
        { studentName: new RegExp(req.query.search, 'i') }
      ];
    }

    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: certificates
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Upload certificate document(s) and map to Certificate ID
// @route   POST /api/certificates/upload-certificate
// @access  Private/Admin
exports.uploadCertificateDocument = async (req, res, next) => {
  try {
     console.log('FILES RECEIVED 👉', req.files); 
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No certificate files uploaded'
      });
    }

    const uploaded = [];
    const skipped = [];

    for (const file of req.files) {
      // Extract certificateId from filename (CERT2024001.pdf → CERT2024001)
      const certificateId = path.basename(
        file.originalname,
        path.extname(file.originalname)
      ).toUpperCase();

      const certificate = await Certificate.findOne({
        certificateId,
        status: 'active'
      });

      if (!certificate) {
        skipped.push({
          file: file.originalname,
          reason: 'Certificate ID not found'
        });
        continue;
      }

      certificate.certificateFile = file.path;
      await certificate.save();

      uploaded.push({
        certificateId,
        file: file.path
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate documents processed',
      data: {
        uploadedCount: uploaded.length,
        skippedCount: skipped.length,
        uploaded,
        skipped
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Search certificate by ID
// @route   GET /api/certificates/search/:certificateId
// @access  Public
exports.searchCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
      status: 'active'
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate as PDF
// @route   GET /api/certificates/download/:certificateId
// @access  Public
exports.downloadCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.toUpperCase(),
      status: 'active'
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(certificate);

    // Increment download count
    await certificate.incrementDownload();

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificateId}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Private/Admin
exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
exports.updateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

  res.status(200).json({
  success: true,
  data: {
    certificateId: certificate.certificateId,
    studentName: certificate.studentName,
    domain: certificate.domain,
    startDate: certificate.startDate,
    endDate: certificate.endDate,
    verified: true,
    certificateFile: certificate.certificateFile || null
  }
});

  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate statistics for dashboard
// @route   GET /api/certificates/stats
// @access  Private (Admin only)
exports.getStats = async (req, res, next) => {
  try {
    const Certificate = require('../models/Certificate');

    // Get total certificates count
    const totalCertificates = await Certificate.countDocuments();

    // Get domain distribution
    const domainDistribution = await Certificate.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          domain: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Calculate percentages
    const distributionWithPercentage = domainDistribution.map(item => ({
      domain: item.domain,
      count: item.count,
      percentage: ((item.count / totalCertificates) * 100).toFixed(1)
    }));

    res.status(200).json({
      success: true,
      data: {
        totalCertificates,
        domainDistribution: distributionWithPercentage
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};