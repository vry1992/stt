import { TranscriptService } from "../transcript-service";
import { WavService } from "../wav-service";

const express = require('express')
const path = require('path')
const cors = require('cors')
const multer = require('multer');
const fs = require('fs');
const app = express()
const port = 3001

app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, './uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Save the file with its original name
        cb(null, file.originalname);
    },
});

// Initialize Multer middleware
const upload = multer({ storage });

console.log(upload)

// Endpoint to handle file uploads
app.post('/', upload.array('audio', 2), async (req, res) => {
    try {
        const files = req.files; // Access uploaded files

        if (!files || files.length < 2) {
            return res.status(400).json({ error: 'Please upload exactly two files' });
        }

        let result = []

        const [first, second] = files;

        const firstPath = path.resolve(__dirname, `./uploads/${first.originalname}`);
        const secondPath = path.resolve(__dirname, `./uploads/${second.originalname}`);

        WavService.normalizeWavFile(firstPath);
        WavService.normalizeWavFile(secondPath);

        console.log(path.resolve(__dirname, `./uploads/${first.originalname}`))

        const a = await TranscriptService.transcript(firstPath);
        const b = await TranscriptService.transcript(secondPath);
        result[0] = a;
        result[1] = b;

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing files' });
    }
});

export const listen = () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

