import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { beginDateZeroTime } from '../functions/dateFunction';

const send = (url, body = {}) => of(body).pipe(
  map((objJSON) => JSON.stringify(objJSON)),
  switchMap((query) => ajax({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: query,
  }).pipe(map((res) => res.response))),
);

const getOneAction = (body = '') => send('/api/oneAction', { id: body });

const getOneOrder = (body = '') => send('/api/oneOrder', { id: body });

const getActions = (body = {}) => send('/api/actions', body);

const getOrders = (body = {}) => send('/api/orders', body);

const editAction = (body = {}, id = null) => {
  const newBody = { ...body };
  if (newBody.date !== undefined) newBody.date = beginDateZeroTime(newBody.date);
  if (id !== null) newBody.id = id;
  return send('/api/action', newBody);
};

const editOrder = (body = {}, id = null) => {
  const newBody = { ...body };
  if (newBody.date !== undefined) newBody.date = beginDateZeroTime(newBody.date);
  if (id !== null) newBody.id = id;
  if (Array.isArray(body.action)) newBody.action = body.action[0];
  return send('/api/order', newBody);
};

const getExcelAction = (body = '') => send('/api/excelAction', { id: body });

const getExcelOrder = (body = '') => send('/api/excelOrder', { id: body });

const getExcelActions = (body = {}) => send('/api/excelActions', body);

const getExcelOrders = (body = {}) => send('/api/excelOrders', body);

export {
  getOneAction,
  getOneOrder,
  getActions,
  getOrders,
  editAction,
  editOrder,
  getExcelAction,
  getExcelActions,
  getExcelOrder,
  getExcelOrders,
};
