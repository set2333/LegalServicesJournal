import React from 'react';
import {
  Table, TableBody, TableHead, TableRow, TableCell,
} from '@material-ui/core';

const Orders = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Дата</TableCell>
        <TableCell>Номер</TableCell>
      </TableRow>
    </TableHead>
    <TableBody />
  </Table>
);

export default Orders;
