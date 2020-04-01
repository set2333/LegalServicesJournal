import React from 'react';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';

const Actions = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Дата регистрации</TableCell>
        <TableCell>Дата</TableCell>
        <TableCell>Номер</TableCell>
        <TableCell>Обвиняемый</TableCell>
        <TableCell>Статья</TableCell>
      </TableRow>
    </TableHead>
    <TableBody />
  </Table>
);

export default Actions;
