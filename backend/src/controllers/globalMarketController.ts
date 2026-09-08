import { Request, Response } from 'express';
import { store } from '../services/store';

export const getGlobalMarketOverview = async (req: Request, res: Response) => {
  try {
    const marketData = store.getGlobalMarketData();
    return res.status(200).json({
      success: true,
      data: marketData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getGlobalReserves = async (req: Request, res: Response) => {
  try {
    const countryReserves = store.getGlobalReserves();
    const marketData = store.getGlobalMarketData();

    return res.status(200).json({
      success: true,
      count: countryReserves.length,
      sourceMetadata: marketData.sourceMetadata,
      countryReserves
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getGlobalTradeFlows = async (req: Request, res: Response) => {
  try {
    const tradeFlows = store.getGlobalTradeFlows();
    return res.status(200).json({
      success: true,
      tradeFlows,
      sourceMetadata: {
        sourceId: 'src-imni-global-market',
        sourceName: 'International Manganese Institute (IMnI) & World Steel Association',
        sourceUrl: 'https://www.manganese.org/market-research',
        dataType: 'PUBLIC_GOVERNMENT',
        isSynthetic: false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getGlobalPricing = async (req: Request, res: Response) => {
  try {
    const pricing = store.getGlobalPricingBenchmarks();
    return res.status(200).json({
      success: true,
      pricing,
      sourceMetadata: {
        sourceId: 'src-imni-global-market',
        sourceName: 'Fastmarkets & Platts Manganese Seaborne Index',
        dataType: 'PUBLIC_GOVERNMENT',
        isSynthetic: false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeepSeaNodules = async (req: Request, res: Response) => {
  try {
    const deepSea = store.getDeepSeaNodules();
    return res.status(200).json({
      success: true,
      deepSeaNodules: deepSea,
      sourceMetadata: {
        sourceId: 'src-moes-isa-deepsea',
        sourceName: 'International Seabed Authority (ISA) & Ministry of Earth Sciences (MoES)',
        sourceUrl: 'https://www.isa.org.jm/exploration-contracts/polymetallic-nodules/',
        dataType: 'PUBLIC_GOVERNMENT',
        isSynthetic: false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoilVsGlobalPeers = async (req: Request, res: Response) => {
  try {
    const peers = store.getMoilVsGlobalPeers();
    return res.status(200).json({
      success: true,
      peers,
      sourceMetadata: {
        sourceId: 'src-usgs-manganese-2024',
        sourceName: 'USGS Mineral Commodity Summaries & Corporate Annual Reports',
        dataType: 'PUBLIC_GOVERNMENT',
        isSynthetic: false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
