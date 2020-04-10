// API функции для получения данных с сервера
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { beginDateZeroTime } from '../functions/dateFunction';

// Основная функция. Непосредственно отправка запроса.
// !!!ВАЖНО!!!. На возвращаемый объект нужно еще и подписатся(subscribe), иначе не заработает!
// В параметрах url - путь запроса. body - объект для передачи.
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

// Получение одного дела. Параметр строка с id дела
const getOneAction = (body = '') => send('/api/oneAction', { id: body });

// Получение одного ордера. Параметр строка с id ордера
const getOneOrder = (body = '') => send('/api/oneOrder', { id: body });

// Получение списка дел. В параметре объект с фильтром
const getActions = (body = {}) => send('/api/actions', body);

// Получение списка ордеров. В параметре объект с фильтром
const getOrders = (body = {}) => send('/api/orders', body);

// Создание / редактирование дела. body - объект с реквизитами дела. id - если null, то создаем
// новое дело, если не null, то id. Находим дело по id и редактируем
const editAction = (body = {}, id = null) => {
  const newBody = { ...body };
  if (newBody.date !== undefined) newBody.date = beginDateZeroTime(newBody.date);
  if (id !== null) newBody.id = id;
  return send('/api/action', newBody);
};

// Создание / редактирование ордера. body - объект с реквизитами ордера. id - если null, то создаем
// новый ордер, если не null, то id. Находим ордер по id и редактируем
const editOrder = (body = {}, id = null) => {
  const newBody = { ...body };
  if (newBody.date !== undefined) newBody.date = beginDateZeroTime(newBody.date);
  if (id !== null) newBody.id = id;
  if (Array.isArray(body.action)) newBody.action = body.action[0];
  return send('/api/order', newBody);
};

// Получение excel файла с одним делом. Вызывается из формы создания / редактирования дела. В
// параметре id дела.
const getExcelAction = (body = '') => send('/api/excelAction', { id: body });

// Получение excel файла со списком дел. Вызывается из списка дел. При этом учитываются фильтры
// самого списка дел. В параметре объект с фильтром.
const getExcelActions = (body = {}) => send('/api/excelActions', body);

export {
  getOneAction,
  getOneOrder,
  getActions,
  getOrders,
  editAction,
  editOrder,
  getExcelAction,
  getExcelActions,
};
