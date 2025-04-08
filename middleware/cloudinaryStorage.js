const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'recipes', // optional folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
});

const upload = multer({ storage });

module.exports = upload;