// Строка таблицы.
import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Table } from '@material-ui/core';
import { areEqual } from '../functions/memoFunction';
import { getLocalDate } from '../functions/dateFunction';

// Получает параметры clickRow - функция при клике на строку таблицы. Может либо
// открывать модальное окно для редактирования дела, либо выбирать дело, для формы редактирования/
// создания ордера.
// children - объект содержащий информацию о деле
const Row = React.memo(
  ({ children, clickRow }) => (
    <TableRow key={children.id} onClick={() => clickRow(children.id)} style={{ cursor: 'pointer' }}>
      <TableCell>{children.creationNumber}</TableCell>
      <TableCell>{getLocalDate(children.creationDate)}</TableCell>
      <TableCell>{children.number}</TableCell>
      <TableCell>{getLocalDate(children.date)}</TableCell>
      <TableCell>{children.issuingAuthority}</TableCell>
      <TableCell>{children.accused}</TableCell>
      <TableCell>{children.article}</TableCell>
      <TableCell>
        <Table>
          {children.orders.map((item) => (
            <TableRow>
              <TableCell>{item.number}</TableCell>
              <TableCell>{getLocalDate(item.date)}</TableCell>
              <TableCell>{item.jurist}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableCell>
    </TableRow>
  ),
  areEqual,
);

Row.propTypes = {
  children: PropTypes.objectOf(PropTypes.string),
  clickRow: PropTypes.func,
};

Row.defaultProps = {
  children: {},
  clickRow: () => {},
};

export default Row;
