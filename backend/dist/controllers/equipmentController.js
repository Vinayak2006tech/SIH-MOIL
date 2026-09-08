"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEquipment = exports.updateEquipment = exports.createEquipment = exports.getEquipmentList = void 0;
const store_1 = require("../services/store");
const getEquipmentList = async (req, res) => {
    try {
        const { mineId, status, type } = req.query;
        let equipment = await store_1.store.getEquipment(mineId);
        if (status) {
            equipment = equipment.filter((e) => e.status === status);
        }
        if (type) {
            equipment = equipment.filter((e) => e.type === type);
        }
        const totalFleet = equipment.length;
        const operationalCount = equipment.filter((e) => e.status === 'OPERATIONAL').length;
        const underMaintenanceCount = equipment.filter((e) => e.status === 'UNDER_MAINTENANCE').length;
        const breakdownCount = equipment.filter((e) => e.status === 'BREAKDOWN').length;
        const avgUptimePct = Math.round(equipment.reduce((acc, e) => acc + (e.uptimePct || 0), 0) / (totalFleet || 1));
        return res.status(200).json({
            success: true,
            stats: {
                totalFleet,
                operationalCount,
                underMaintenanceCount,
                breakdownCount,
                avgUptimePct
            },
            equipment
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getEquipmentList = getEquipmentList;
const createEquipment = async (req, res) => {
    try {
        const { code, name, mineId, type, model, capacity, status, lastMaintenanceDate, nextScheduledMaintenance } = req.body;
        if (!code || !name || !mineId || !type) {
            return res.status(400).json({ success: false, message: 'Code, name, mineId, and type are required.' });
        }
        const mine = await store_1.store.getMineById(mineId);
        const mineName = mine ? mine.name : 'Balaghat Underground Mine';
        const newEquipment = await store_1.store.addEquipment({
            code,
            name,
            mineId,
            mineName,
            type,
            equipmentModel: model || 'Standard Mining Spec',
            capacity: capacity || 'Standard Load',
            status: status || 'OPERATIONAL',
            uptimePct: 85.0,
            operatingHoursTotal: 120,
            mtbfHours: 150,
            mttrHours: 4.0,
            lastMaintenanceDate: lastMaintenanceDate || new Date().toISOString().split('T')[0],
            nextScheduledMaintenance: nextScheduledMaintenance || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            healthScorePct: 95.0,
            fuelEfficiencyLtrHr: 26.0,
            criticalAlert: ''
        });
        return res.status(201).json({
            success: true,
            message: 'Equipment registered successfully',
            equipment: newEquipment
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createEquipment = createEquipment;
const updateEquipment = async (req, res) => {
    try {
        const { code } = req.params;
        const updates = req.body;
        const updated = await store_1.store.updateEquipment(code, updates);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Equipment not found.' });
        }
        return res.status(200).json({
            success: true,
            message: 'Equipment record updated successfully',
            equipment: updated
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateEquipment = updateEquipment;
const deleteEquipment = async (req, res) => {
    try {
        const { code } = req.params;
        const deleted = await store_1.store.deleteEquipment(code);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Equipment not found.' });
        }
        return res.status(200).json({
            success: true,
            message: 'Equipment decommissioned and removed from registry'
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteEquipment = deleteEquipment;
