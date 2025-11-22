import express from 'express';
import { Link } from '../models/Link.js';

const router = express.Router();

// Get all links for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const links = await Link.find({ userId }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new link
router.post('/', async (req, res) => {
  try {
    const { url, platform, userId } = req.body;
    
    if (!url || !platform || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const link = new Link({ url, platform, userId });
    const savedLink = await link.save();
    res.status(201).json(savedLink);
  } catch (error) {
    console.error('Error saving link:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a link
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLink = await Link.findByIdAndDelete(id);
    res.json({ message: 'Link deleted', deletedLink });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
