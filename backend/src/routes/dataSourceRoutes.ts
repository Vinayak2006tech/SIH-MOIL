import { Router } from 'express';
import { getDataSources, getDataSourceById } from '../controllers/dataSourceController';

const router = Router();

router.get('/', getDataSources);
router.get('/:id', getDataSourceById);

export default router;
