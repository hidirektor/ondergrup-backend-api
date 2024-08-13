const SubUsers = require('../../../models/SubUser');
const Users = require('../../../models/User');
const UserPreferences = require('../../../models/UserPreferences');
const MachineData = require("../../../models/MachineData");

/**
 * @swagger
 * /getAllSubUsers:
 *   get:
 *     summary: Get all active sub users
 *     tags: [Authorized]
 *     responses:
 *       200:
 *         description: List of active sub users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully retrieved all sub users.'
 *                 payload:
 *                   type: object
 *                   properties:
 *                     subUserDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           ownerID:
 *                             type: string
 *                             example: 'cfc88d7f-e7a6-43a1-92fc-305217e59335'
 *                           userID:
 *                             type: string
 *                             example: 'cfc88d7f-e7a6-43a1-92fc-305217e59335'
 *                           ownerName:
 *                             type: string
 *                             example: 'hidirektor'
 *                           subUserData:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/User'
 *
 *       404:
 *         description: No active sub users found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No active sub users found in the database.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

module.exports = async (req, res) => {
    try {
        const subusers = await SubUsers.findAll({});
        if (!subusers.length) {
            return res.status(404).json({ message: 'No sub users found in the database.' });
        }

        const subUserDetails = await Promise.all(subusers.map(async (subuser) => {
            const ownerID = subuser.ownerID;
            let ownerName = "NaN";
            if(ownerID) {
                const user = await Users.findOne({ where: { userID: ownerID } });
                ownerName = user.userName;
            }

            const subUserID = subuser.userID;
            const subUserData = await Users.findAll({ where: { userID: subUserID } });
            return {
                ...subuser.dataValues,
                ownerName,
                subUserData
            };
        }));

        res.status(200).json({ message: 'Successfully retrieved all sub users.', payload: { subUserDetails } });
    } catch (error) {
        console.log('Error retrieving all sub users', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};