const express = require('express');
const {
  uploadCertificates,
  uploadCertificateDocument,
  getCertificates,
  searchCertificate,
  downloadCertificate,
  getCertificate,
  updateCertificate,
  deleteCertificate,
  getStats
} = require('../controllers/certificateController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/* ===== PUBLIC ===== */
router.get('/search/:certificateId', searchCertificate);
router.get('/download/:certificateId', downloadCertificate);

/* ===== ADMIN ===== */
router.get('/stats', protect, authorize('admin'), getStats);

/* Excel upload */
router.post(
  '/upload',
  protect,
  authorize('admin'),
  upload.single('file'),
  uploadCertificates
);

/* Certificate PDF/JPG upload */
router.post(
  '/upload-certificate',
  protect,
  authorize('admin'),
  upload.array('files', 20),
  uploadCertificateDocument
);

router.get('/', protect, authorize('admin'), getCertificates);
router.get('/:id', protect, authorize('admin'), getCertificate);
router.put('/:id', protect, authorize('admin'), updateCertificate);
router.delete('/:id', protect, authorize('admin'), deleteCertificate);

module.exports = router;