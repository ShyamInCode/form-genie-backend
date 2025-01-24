import express from 'express';
import validate from '../../middlewares/validate';
import { addFormJson,  addFormRecord,  findDE,  getAccessToken,  getAllFormAllDocuments, getFormJson } from './form.controller';
import formValidation from './form.validation';
const router = express.Router();

router.post('/',validate(formValidation.postJSONForm), addFormJson);
router.post('/de',validate(formValidation.findDE), findDE);
router.post('/record/:deId', validate(formValidation.postFormRecord), addFormRecord);
router.get('/:id', getFormJson);
router.post('/token', validate(formValidation.getAccessToken), getAccessToken);

router.get('/', getAllFormAllDocuments);
export default router;
