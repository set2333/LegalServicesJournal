// Таблица со списком ордеров
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';
import { getOrders } from '../api/api';
import Row from './Row';

const Orders = ({
  startDate, endDate, filter, clickRow, hiden, uid,
}) => {
  if (hiden) return null;
  const [rows, setRows] = useState([]);
  // Если поменялись даты, фильтры или uid - получим новые данные на сервере
  useEffect(() => {
    getOrders({ startDate: new Date(startDate), endDate: new Date(endDate), filter }).subscribe(
      (response) => setRows(response),
      (err) => console.log('ERR: ', err),
    );
  }, [startDate, endDate, filter, uid]);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Номер</TableCell>
          <TableCell>Дата</TableCell>
          <TableCell>Номер постановления</TableCell>
          <TableCell>Дата постановления</TableCell>
          <TableCell>Обвиняемый</TableCell>
          <TableCell>Адвокат</TableCell>
          <TableCell>Статья</TableCell>
          <TableCell>Дело</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((item) => (
          <Row clickRow={clickRow}>{item}</Row>
        ))}
      </TableBody>
    </Table>
  );
};

Orders.propTypes = {
  startDate: PropTypes.instanceOf(Date), // Начальная дата для фильтра
  endDate: PropTypes.instanceOf(Date), // Конечная дата для фильтра
  filter: PropTypes.arrayOf(PropTypes.object), // Масив с фильтрами
  clickRow: PropTypes.func, // Функция клика по строке. Перенаправляется в компонент Row
  hiden: PropTypes.bool, // Видимость компонента. Если false возвращается null
  uid: PropTypes.string, // UID. Если мы создали новый ордер uid меняется и мы заново рендерим
  // таблицу. Иначе новый ордер не попадает в таблицу.
};

Orders.defaultProps = {
  startDate: new Date(),
  endDate: new Date(),
  filter: [],
  clickRow: () => {},
  hiden: true,
  uid: '',
};

export default React.memo(Orders);
