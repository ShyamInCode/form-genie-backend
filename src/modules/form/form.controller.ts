import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { RETRIEVE_REQUEST_TYPE } from './form.constants';
import { iPagination } from './form.dto';
import formService from './form.service';

export const addFormJson = catchAsync(async (req: Request, res: Response) => {

  const respnse = await formService.addFormJson(req.body);

  res.json({ data: respnse });
});

export const addFormRecord = catchAsync(async (req: Request, res: Response) => {

  const respnse = await formService.addFormRecord(req.body,req.params.deId);

  res.json({ data: respnse });
});

export const getAccessToken = catchAsync(async (req: Request, res: Response) => {

  const respnse = await formService.getAccessToken(req.body,req.body.subdomain);

  res.json({ data: respnse });
});


export const getFormJson = catchAsync(async (req: Request, res: Response) => {

  const respnse = await formService.getFormJsonById(req.params.id as string);

  res.json({ data: respnse });
});

export const getAllFormAllDocuments = catchAsync(async (req: Request, res: Response) => {
  const respnse = await formService.getAllFormAllDocuments(req.query as unknown as iPagination);
  res.json({ data: respnse });
});

export const findDE = catchAsync(async (req: Request, res: Response) => {
  if(req.body.name=='all'){
    const promises= RETRIEVE_REQUEST_TYPE.map(type=>formService.findDE({...req.body, name: type.name}))
    const respnse = await Promise.all(promises)
    res.json({ data: respnse.flat() });
}
else{
    const respnse = await formService.findDE(req.body);
    res.json({ data: respnse });
}
 
});
