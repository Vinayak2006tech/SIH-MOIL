import { Router } from 'express';
import {
  getGlobalMarketOverview,
  getGlobalReserves,
  getGlobalTradeFlows,
  getGlobalPricing,
  getDeepSeaNodules,
  getMoilVsGlobalPeers
} from '../controllers/globalMarketController';

const router = Router();

router.get('/overview', getGlobalMarketOverview);
router.get('/reserves', getGlobalReserves);
router.get('/trade-flows', getGlobalTradeFlows);
router.get('/pricing', getGlobalPricing);
router.get('/deep-sea', getDeepSeaNodules);
router.get('/peers', getMoilVsGlobalPeers);

export default router;
