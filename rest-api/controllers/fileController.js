const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path');
const baseUrl = "http://localhost:3000/data/";

const uploadFile = require("../middleware/upload");

module.exports = {
    upload: async(req, res, next) => {
        try {
            await uploadFile(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

            const { username } = req.body;

            if (!username) {
                return res.status(400).send({ message: "Please provide a username!" });
            }

            const newFileName = `${username}${path.extname(req.file.originalname)}`;
            const userDirectory = path.join(__basedir, `/data/profilePhoto/`);

            if (!fs.existsSync(userDirectory)) {
                fs.mkdirSync(userDirectory, { recursive: true });
            }

            const filePath = path.join(userDirectory, newFileName);
            fs.renameSync(req.file.path, filePath);

            res.status(200).send({
                message: "Uploaded the file successfully: " + newFileName,
            });
        } catch (err) {
            console.log(err);

            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }

            res.status(500).send({
                message: `Could not upload the file. ${err}`,
            });
        }
    },

    uploadPDF: async(req, res, next) => {
        try {
            await uploadFile(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

            const { username } = req.body;

            if (!username) {
                return res.status(400).send({ message: "Please provide a username!" });
            }

            const newFileName = `${username}${path.extname(req.file.originalname)}`;
            const userDirectory = path.join(__basedir, `/data/hydraulicUnits/`);

            if (!fs.existsSync(userDirectory)) {
                fs.mkdirSync(userDirectory, { recursive: true });
            }

            const filePath = path.join(userDirectory, newFileName);
            fs.renameSync(req.file.path, filePath);

            res.status(200).send({
                message: "Uploaded the file successfully: " + newFileName,
            });
        } catch (err) {
            console.log(err);

            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }

            res.status(500).send({
                message: `Could not upload the file. ${err}`,
            });
        }
    },

    uploadExcel: async(req, res, next) => {
        try {
            await uploadFile(req, res);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

            const { username } = req.body;

            if (!username) {
                return res.status(400).send({ message: "Please provide a username!" });
            }

            const newFileName = `${username}${path.extname(req.file.originalname)}`;
            const userDirectory = path.join(__basedir, `/data/partList/`);

            if (!fs.existsSync(userDirectory)) {
                fs.mkdirSync(userDirectory, { recursive: true });
            }

            const filePath = path.join(userDirectory, newFileName);
            fs.renameSync(req.file.path, filePath);

            res.status(200).send({
                message: "Uploaded the file successfully: " + newFileName,
            });
        } catch (err) {
            console.log(err);

            if (err.code == "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }

            res.status(500).send({
                message: `Could not upload the file. ${err}`,
            });
        }
    },

    getListFiles: async(req, res, next) => {
        const directoryPath = __basedir + "/data/";

        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                });
            }

            let fileInfos = [];

            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: baseUrl + file,
                });
            });

            res.status(200).send(fileInfos);
        });
    },

    download: async(req, res, next) => {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({
                message: "Please provide a username in the request body!",
            });
        }

        const fileName = `${username}.jpg`;
        const directoryPath = __basedir + `/data/profilePhoto/`;

        res.download(directoryPath + fileName, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
            }
        });
    },

    downloadPhoto: async(req, res, next) => {
        const { username } = req.body;

        const directoryPath = __basedir + `/data/profilePhoto/`;

        if (!username) {
            return res.status(400).json({ error: 'Username is required.' });
        }

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'An error occurred while reading the directory.' });
            }

            const matchingFiles = files.filter(file => file.startsWith(username));

            if (matchingFiles.length === 0) {
                return res.status(404).json({ error: 'No matching photo found.' });
            }

            const photoPath = path.join(directoryPath, matchingFiles[0]);
            res.sendFile(photoPath);
        });
    },

    remove: async(req, res, next) => {
        const fileName = req.params.name;
        const directoryPath = __basedir + "/data/";

        fs.unlink(directoryPath + fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not delete the file. " + err,
                });
            }

            res.status(200).send({
                message: "File is deleted.",
            });
        });
    },

    removeSync: async(req, res, next) => {
        const fileName = req.params.name;
        const directoryPath = __basedir + "/data/";

        try {
            fs.unlinkSync(directoryPath + fileName);

            res.status(200).send({
                message: "File is deleted.",
            });
        } catch (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }
    },

    view: async(req, res, next) => {
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
    },

    viewer: async(req, res, next) => {
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
    }
}
