const multer = require('multer');

const MIME_TYPES_CV = {
  'application/pdf': 'pdf',
  'text/html': 'html',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  'docx'
};

const MIME_TYPES_AVATAR = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'public', 'images'));
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES_AVATAR[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const cvStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public', 'uploads', 'cvs');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.').slice(0, -1).join('.');
    const extension = MIME_TYPES_CV[file.mimetype];
    const date = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    callback(null, `${name}_${date}.${extension}`);
  }
});


const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');
const uploadCv = multer({ storage: cvStorage }).single('cv');

module.exports = { uploadAvatar, uploadCv };