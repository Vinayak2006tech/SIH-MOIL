"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvBuffer = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    fileFilter: (req, file, cb) => {
        const isCsv = !file.mimetype ||
            file.mimetype.includes('csv') ||
            file.mimetype.includes('text') ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/octet-stream' ||
            file.originalname.toLowerCase().endsWith('.csv');
        if (isCsv) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed.'));
        }
    }
});
const parseCsvBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = stream_1.Readable.from(buffer);
        stream
            .pipe((0, csv_parser_1.default)({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, ''),
            mapValues: ({ value }) => (typeof value === 'string' ? value.trim() : value)
        }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};
exports.parseCsvBuffer = parseCsvBuffer;
