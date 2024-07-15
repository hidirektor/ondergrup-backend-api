const Version = require('../../models/Version');
const { Op } = require('sequelize');

const checkUpdates = async (req, res) => {
    try {
        const { currentVersion } = req.body;

        if (!currentVersion) {
            return res.status(400).json({ message: 'currentVersion is required' });
        }

        const update = await Version.findOne({
            where: {
                versionCode: {
                    [Op.gt]: currentVersion
                }
            },
            order: [['versionCode', 'DESC']]
        });

        if (update) {
            return res.status(200).json({
                updateAvailable: true,
                update,
                fileSize: update.fileSize,
                crc: update.crc
            });
        } else {
            return res.status(200).json({ updateAvailable: false });
        }
    } catch (error) {
        console.error('Error checking updates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkUpdates;