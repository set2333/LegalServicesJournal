// Таблица со списком дел
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';
import { getActions } from '../api/api';
import Row from './Row';

const Actions = ({
  startDate, endDate, filter, clickRow, uid,
}) => {
  const [rows, setRows] = useState([]);
  // Если поменялись даты, фильтры или uid - получим новые данные на сервере
  useEffect(() => {
    getActions({ startDate: new Date(startDate), endDate: new Date(endDate), filter }).subscribe(
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
          <TableCell>Номер дела</TableCell>
          <TableCell>Дата дела</TableCell>
          <TableCell>Выданно</TableCell>
          <TableCell>Обвиняемый</TableCell>
          <TableCell>Статья</TableCell>
          <TableCell>Ордер(номер, дата, адвокат)</TableCell>
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

Actions.propTypes = {
  startDate: PropTypes.instanceOf(Date), // Начальная дата для фильтра
  endDate: PropTypes.instanceOf(Date), // Конечная дата для фильтра
  filter: PropTypes.arrayOf(PropTypes.object), // Масив с фильтрами
  clickRow: PropTypes.func, // Функция клика по строке. Перенаправляется в компонент Row
  uid: PropTypes.string, // UID. Если мы создали новое дело uid меняется и мы заново рендерим
  // таблицу. Иначе новое дело не попадает в таблицу.
};

Actions.defaultProps = {
  startDate: new Date(),
  endDate: new Date(),
  filter: [],
  clickRow: () => {},
  uid: '',
};

export default React.memo(Actions);
