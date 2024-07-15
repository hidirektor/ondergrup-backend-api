const UserPreferences = require('../../models/UserPreferences');

module.exports = async (req, res) => {
    const { userID, preferencesData } = req.body;

    const userPreferences = await UserPreferences.findOne({ where: { userID } });
    if (!userPreferences) return res.status(404).json({ message: 'Preferences not found' });

    await userPreferences.update(preferencesData);

    res.json({ message: 'Preferences updated successfully' });
};