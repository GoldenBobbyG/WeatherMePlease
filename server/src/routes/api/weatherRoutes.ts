import { Router, type Request, type Response } from 'express';
const router = Router();
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData[0], weatherData.slice(1));
    // Save city to search history
    await HistoryService.addCity(cityName);
    return res.json(weatherData[0]);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.json(history);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'There was an error retrieving search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await HistoryService.removeCity(id);
    res.json({ success: 'City removed from search history' }).send();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;