const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require('path');
const baseUrl = "http://localhost:3000/data/";

const uploadFile = require("../requests/util/upload");

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: "Please provide a username!" });
        }

        const newFileName = `${username}_profilePhoto${path.extname(req.file.originalname)}`;
        const userDirectory = path.join(__basedir, `/data/${username}/`);

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
};

const getListFiles = (req, res) => {
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
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/data/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

const remove = (req, res) => {
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
};

const removeSync = (req, res) => {
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
};

router.post('/upload', upload);
router.get('/listFiles', getListFiles);
router.get('/download/:name', download);
router.delete('/remove/:name', remove);
router.delete('/removeSync/:name', removeSync);

module.exports = router;