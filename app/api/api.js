import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

const getOneAction = (body = {}) => send('/api/action', body);

const getOneOrder = () => {};

const getActions = (body = {}) => send('/api/actions', body);

const getOrders = (body = {}) => send('/api/orders', body);

const editAction = (body = {}) => send('/api/action', body);

const editOrder = () => {};

export {
  getOneAction, getOneOrder, getActions, getOrders, editAction, editOrder,
};
