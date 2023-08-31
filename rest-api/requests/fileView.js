const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/view/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const fileExtension = path.extname(fileName).toLowerCase();
    let filePath = '';

    if (fileExtension === '.pdf') {
        filePath = path.join(__dirname, 'data', 'hydraulicUnits', fileName);
    } else if (fileExtension === '.xlsx') {
        filePath = path.join(__dirname, 'data', 'partList', fileName);
    } else {
        return res.status(400).send('Invalid file format');
    }

    const contentType = fileExtension === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (contentType !== 'application/pdf' && contentType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return res.status(400).send('Invalid file format');
    }

    const viewerURL = `/viewer/${fileName}`;
    const viewerHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>File Viewer</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f0f0f0;
                }
                iframe {
                    border: none;
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <iframe src="${viewerURL}" allowfullscreen></iframe>
        </body>
        </html>
    `;

    res.send(viewerHTML);
});

router.get('/viewer/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const fileExtension = path.extname(fileName).toLowerCase();
    let filePath = '';

    if (fileExtension === '.pdf') {
        filePath = path.join(__basedir, 'data', 'hydraulicUnits', fileName);
    } else if (fileExtension === '.xlsx') {
        filePath = path.join(__basedir, 'data', 'partList', fileName);
    } else {
        return res.status(400).send('Invalid file format');
    }

    const contentType = fileExtension === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    res.setHeader('Content-Type', contentType);

    if (contentType === 'application/pdf' || contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
    }

    res.sendFile(filePath);
});

module.exports = router;