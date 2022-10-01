import express from 'express';
const router = express.Router();

// Import route functions
import { getFileRoute, addFileRoute } from './routes';

// Root
router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Audiofiler File API');
});

// Songs
router.get('/:dir/:fileName', getFileRoute);
router.post('/songs', addFileRoute);
router.post('/zips', addFileRoute);

// necessary with express.Router()
module.exports = router;
