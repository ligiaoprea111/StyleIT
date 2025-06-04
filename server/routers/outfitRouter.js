import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../models/index.js'; // Import db for model access

const router = express.Router();

// Protect all outfit routes with authentication middleware
router.use(authenticateToken);

// Placeholder for Save Outfit endpoint (POST /api/outfits)
router.post('/', async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user
        const { name, date, itemIds } = req.body;

        if (!name || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
            return res.status(400).json({ error: 'Outfit name and at least one item are required.' });
        }

        // Create the new outfit
        const newOutfit = await db.Outfit.create({
            userId: userId,
            name: name,
            date: date || null, // Use provided date or null
        });

        // Associate clothing items with the outfit
        const clothingItems = await db.ClothingItem.findAll({ where: { id: itemIds } });
        await newOutfit.addClothingItems(clothingItems);

        // Fetch the saved outfit with its associated items for the response
        const savedOutfit = await db.Outfit.findOne({
            where: { id: newOutfit.id },
            include: db.ClothingItem // Include associated clothing items
        });

        res.status(201).json(savedOutfit);

    } catch (error) {
        console.error('Error saving outfit:', error);
        res.status(500).json({ error: 'Failed to save outfit.' });
    }
});

// Placeholder for Get User Outfits endpoint (GET /api/outfits)
router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user

        const userOutfits = await db.Outfit.findAll({
            where: { userId: userId },
            include: db.ClothingItem // Include associated clothing items
        });

        res.status(200).json(userOutfits);

    } catch (error) {
        console.error('Error fetching user outfits:', error);
        res.status(500).json({ error: 'Failed to fetch user outfits.' });
    }
});

// Endpoint for Get Single Outfit (GET /api/outfits/:id)
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user
        const outfitId = req.params.id;

        const outfit = await db.Outfit.findOne({
            where: { id: outfitId, userId: userId },
            include: db.ClothingItem // Include associated clothing items
        });

        if (!outfit) {
            return res.status(404).json({ error: 'Outfit not found or you don\'t have permission to view it.' });
        }

        res.status(200).json(outfit);

    } catch (error) {
        console.error('Error fetching single outfit:', error);
        res.status(500).json({ error: 'Failed to fetch outfit.' });
    }
});

// Endpoint for Update Outfit (PUT /api/outfits/:id)
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user
        const outfitId = req.params.id;
        const { name, date, itemIds } = req.body;

        // Find the outfit to update and ensure it belongs to the authenticated user
        const outfit = await db.Outfit.findOne({
            where: { id: outfitId, userId: userId },
            include: db.ClothingItem // Include current items to compare/manage associations
        });

        if (!outfit) {
            return res.status(404).json({ error: 'Outfit not found or you don\'t have permission to edit it.' });
        }

        // Update outfit details (name, date)
        outfit.name = name || outfit.name; // Update name if provided
        outfit.date = date !== undefined ? (date || null) : outfit.date; // Update date if provided (allow null)
        await outfit.save();

        // Update associated clothing items if itemIds are provided
        if (itemIds !== undefined && Array.isArray(itemIds)) {
             // Get current item IDs
            const currentItemIds = outfit.ClothingItems.map(item => item.id);

            // Items to remove (currently associated but not in new list)
            const itemsToRemoveIds = currentItemIds.filter(id => !itemIds.includes(id));
            if (itemsToRemoveIds.length > 0) {
                const itemsToRemove = await db.ClothingItem.findAll({ where: { id: itemsToRemoveIds } });
                await outfit.removeClothingItems(itemsToRemove);
            }

            // Items to add (in new list but not currently associated)
            const itemsToAddIds = itemIds.filter(id => !currentItemIds.includes(id));
             if (itemsToAddIds.length > 0) {
                const itemsToAdd = await db.ClothingItem.findAll({ where: { id: itemsToAddIds } });
                await outfit.addClothingItems(itemsToAdd);
            }
        }

        // Fetch the updated outfit with its associated items for the response
        const updatedOutfit = await db.Outfit.findOne({
            where: { id: outfit.id },
            include: db.ClothingItem // Include associated clothing items
        });

        res.status(200).json(updatedOutfit);

    } catch (error) {
        console.error('Error updating outfit:', error);
        res.status(500).json({ error: 'Failed to update outfit.' });
    }
});

// Endpoint for Delete Outfit (DELETE /api/outfits/:id)
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user
        const outfitId = req.params.id;

        // Find the outfit to delete and ensure it belongs to the authenticated user
        const outfit = await db.Outfit.findOne({
            where: { id: outfitId, userId: userId }
        });

        if (!outfit) {
            return res.status(404).json({ error: 'Outfit not found or you don\'t have permission to delete it.' });
        }

        // Delete the outfit
        await outfit.destroy();

        res.status(200).json({ message: 'Outfit deleted successfully.' });

    } catch (error) {
        console.error('Error deleting outfit:', error);
        res.status(500).json({ error: 'Failed to delete outfit.' });
    }
});

export default router; 