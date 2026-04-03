const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs'); 
const app = express();

// Use the port provided by the host (Render/Railway) or 3000 locally
const PORT = process.env.PORT || 3000;

app.use(fileUpload());
app.use(express.static('public')); 
app.use('/videos', express.static('videos'));

app.get('/get-videos/:playerName', (req, res) => {
    const playerName = req.params.playerName;
    const folderPath = path.join(__dirname, 'videos', playerName);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    fs.readdir(folderPath, (err, files) => {
        if (err) return res.status(500).send("Error");
        const videoFiles = files.filter(file => 
            ['.mp4', '.webm', '.mov'].includes(path.extname(file).toLowerCase())
        ).map(file => ({
            url: `videos/${playerName}/${file}`,
            label: path.parse(file).name.replace(/-/g, ' ').toUpperCase() 
        }));
        res.json(videoFiles);
    });
});

app.post('/upload', (req, res) => {
    if (!req.files) return res.status(400).send('No files.');
    const video = req.files.videoFile;
    const playerName = req.body.playerName; 
    const caption = req.body.label || "Match Clip";
    const cleanName = caption.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const ext = path.extname(video.name);
    const savePath = path.join(__dirname, 'videos', playerName, `${cleanName}${ext}`);
    
    video.mv(savePath, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ status: "success" });
    });
});

app.listen(PORT, () => console.log(`🚀 Site live on port ${PORT}`));