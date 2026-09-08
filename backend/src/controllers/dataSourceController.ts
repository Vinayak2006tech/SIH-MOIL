import { Request, Response } from 'express';
import DataSource from '../models/DataSource';
import { memoryStore } from '../services/store';

export const getDataSources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dataType, isSynthetic } = req.query;

    if (memoryStore.isMemoryMode) {
      let sources = memoryStore.getDataSources();
      if (dataType) {
        sources = sources.filter((s) => s.dataType === dataType);
      }
      if (isSynthetic !== undefined) {
        const synBool = isSynthetic === 'true';
        sources = sources.filter((s) => s.isSynthetic === synBool);
      }
      res.status(200).json({
        success: true,
        count: sources.length,
        dataSources: sources
      });
      return;
    }

    const filter: any = {};
    if (dataType) filter.dataType = dataType;
    if (isSynthetic !== undefined) filter.isSynthetic = isSynthetic === 'true';

    const sources = await DataSource.find(filter).sort({ isSynthetic: 1, sourceName: 1 });
    res.status(200).json({
      success: true,
      count: sources.length,
      dataSources: sources
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDataSourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (memoryStore.isMemoryMode) {
      const source = memoryStore.getDataSources().find((s) => s.sourceId === id);
      if (!source) {
        res.status(404).json({ success: false, message: `Data source ${id} not found` });
        return;
      }
      res.status(200).json({ success: true, dataSource: source });
      return;
    }

    const source = await DataSource.findOne({ sourceId: id });
    if (!source) {
      res.status(404).json({ success: false, message: `Data source ${id} not found` });
      return;
    }
    res.status(200).json({ success: true, dataSource: source });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
