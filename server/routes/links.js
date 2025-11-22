import express from 'express';
import { Link } from '../models/Link.js';

const router = express.Router();

// Get all links for a user
router.get('/links/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const links = await Link.find({ userId }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new link
router.post('/links', async (req, res) => {
  try {
    const { url, platform, userId } = req.body;
    
    if (!url || !platform || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const link = new Link({ url, platform, userId });
    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a link
router.delete('/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Link.findByIdAndDelete(id);
    res.json({ message: 'Link deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
