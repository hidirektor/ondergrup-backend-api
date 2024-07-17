const HydraulicUnit = require('../../models/HydraulicUnit');

const getHydraulicUnitNumber = async (req, res) => {
    try {
        const allOrderNumbers = await HydraulicUnit.find({}, 'orderID');

        const orderNumbers = allOrderNumbers.map((order) => order.orderID.trim());

        res.json(orderNumbers);
    } catch (error) {
        console.error('Error retrieving HydraulicUnit part list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getHydraulicUnitNumber;