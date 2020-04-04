import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';
import { getOrders } from '../api/api';
import { getLocalDate } from '../functions/dateFunction';

const Row = ({ children, clickRow }) => (
  <TableRow key={children._id} onClick={() => clickRow(children._id)}>
    <TableCell>{children.creationNumber}</TableCell>
    <TableCell>{getLocalDate(children.creationDate)}</TableCell>
    <TableCell>{children.number}</TableCell>
    <TableCell>{getLocalDate(children.date)}</TableCell>
    <TableCell>{children.accused}</TableCell>
    <TableCell>{children.jurist}</TableCell>
    <TableCell>{children.article}</TableCell>
    <TableCell>{children.actionString}</TableCell>
  </TableRow>
);

const Orders = ({
  startDate, endDate, filter, clickRow,
}) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getOrders({ startDate: new Date(startDate), endDate: new Date(endDate), filter }).subscribe(
      (response) => {
        setRows(response);
      },
      (err) => console.log('ERR: ', err),
    );
  }, [startDate, endDate, filter]);
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

export default Orders;
