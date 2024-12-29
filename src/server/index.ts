import { DEFAULT_OPTIONS, TranscriptService } from "../transcript-service";
import { WavService } from "../wav-service";
import { spawn } from 'child_process';

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
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/', upload.array('audio', 2), async (req, res) => {
    try {
        const files = req.files; // Access uploaded files

        if (!files) {
            return res.status(400).json({ error: 'Please upload at least one file' });
        }

        let options = DEFAULT_OPTIONS;

        const withCuda = req.body.gpu === 'true';

        if (withCuda) {
            options = {
                ...DEFAULT_OPTIONS,
                withCuda
            }
        }

        let result = []

        const [first, second] = files;

        if (first) {
            const firstPath = path.resolve(__dirname, `./uploads/${first.originalname}`);
            WavService.normalizeWavFile(firstPath);
            const firstTranscribingResult = await TranscriptService.transcript(firstPath, options);
            result[0] = firstTranscribingResult;
        }

        if (second) {
            const secondPath = path.resolve(__dirname, `./uploads/${second.originalname}`);
            WavService.normalizeWavFile(secondPath);
            const secondTranscribingResult = await TranscriptService.transcript(secondPath, options);
            result[1] = secondTranscribingResult;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing files' });
    }
});

app.get('/restart', (req, res) => {
    res.json({ok: 'OK'})
});

export const listen = () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

