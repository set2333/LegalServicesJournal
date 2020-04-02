import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';
import { getActions } from '../api/api';

const Row = ({ children }) => (
  <TableRow key={children._id}>
    <TableCell>{children.creationNumber}</TableCell>
    <TableCell>{new Date(children.creationDate).toLocaleDateString()}</TableCell>
    <TableCell>{children.number}</TableCell>
    <TableCell>{new Date(children.date).toLocaleDateString()}</TableCell>
    <TableCell>{children.accused}</TableCell>
    <TableCell>{children.article}</TableCell>
  </TableRow>
);

const Actions = ({ startDate, endDate, filter }) => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getActions({ startDate: new Date(startDate), endDate: new Date(endDate), filter }).subscribe(
      (response) => {
        setRows(response);
      },
      (err) => console.log('ERR: ', err),
    );
  }, [startDate, endDate]);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Номер</TableCell>
          <TableCell>Дата</TableCell>
          <TableCell>Номер постановления</TableCell>
          <TableCell>Дата постановления</TableCell>
          <TableCell>Обвиняемый</TableCell>
          <TableCell>Статья</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((item) => (
          <Row>{item}</Row>
        ))}
      </TableBody>
    </Table>
  );
};

export default Actions;
