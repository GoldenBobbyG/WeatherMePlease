import { Router, type Request, type Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityName = req.body.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherByCityName(cityName);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
  // TODO: save city to search history
  await HistoryService.saveCityToHistory(cityName);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {});
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {});
router.delete('/history/:id', async (_req: Request, res: Response) => {
  const id = _req.params.id;
  try {
    await HistoryService.deleteCityFromHistory(id);
    res.json({ message: 'City deleted from search history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
