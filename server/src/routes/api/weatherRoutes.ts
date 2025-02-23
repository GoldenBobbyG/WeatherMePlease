import { Router, type Request, type Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';


// All of these routes are prefixed with '/api/weather'
// TODO: POST Request with city name to retrieve weather data

router.post('/api/weather/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const cityName = req.body.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    return res.json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
  // TODO: save city to search history
  await HistoryService.addCity(cityName);
 
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {  // This endpoint is 'api/weather/history' w/ GET HTTP request method
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await HistoryService.removeCity(id);
    res.json({ message: 'City deleted from search history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
