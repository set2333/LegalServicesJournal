// Функции работы с датой

// Функция получает значение и пытается привести его к дате. Если удастся, то возвращает строку с
// датой в локалтном формате. Иначе вернет то, что было переданно.
const getLocalDate = (date) => {
  const result = new Date(date);
  return result.toString() === 'Invalid Date' ? '' : result.toLocaleDateString();
};

// Функция получает значение и пытается привести его к дате. Если удастся, то возвращает начало дня.
// Иначе вернет то, что было переданно.
const beginDay = (date) => {
  const result = new Date(date);
  return Number.isNaN(result)
    ? date
    : new Date(result.getFullYear(), result.getMonth(), result.getDate(), 0, 0, 0, 0);
};

// Функция получает значение и пытается привести его к дате. Если удастся, то возвращает конец дня.
// Иначе вернет то, что было переданно.
const endDay = (date) => {
  const result = new Date(date);
  return Number.isNaN(result)
    ? date
    : new Date(result.getFullYear(), result.getMonth(), result.getDate(), 23, 59, 59, 999);
};

// Функция возвращает начало дня по нулевому часовому поясу. Нужно для сохранения даты внесения
// дела или ордера и поиска дела или ордера по дате. На сервер отправляется дата начала дня со
// смещение по часовому поясу. Сервер переводит эту дату в свой часовой пояс и сохраняет дату с
// нулевым временем. Таким образом на сервере будет хранится корректная дата, а клиенты будут
// запрашивать её со свои временным смещением.
const beginDateZeroTime = (date) => {
  const result = new Date(date);
  return Number.isNaN(result)
    ? date
    : new Date(
      result.getFullYear(),
      result.getMonth(),
      result.getDate(),
      0,
      -new Date().getTimezoneOffset(),
      0,
      0,
    );
};

// Функция получает значение и пытается привести его к дате. Если удастся, то возвращает дату на
// месяц меньше. Иначе вернет то, что было переданно.
const agoMonth = (date) => {
  const result = new Date(date);
  return Number.isNaN(result)
    ? date
    : new Date(result.getFullYear(), result.getMonth() - 1, result.getDate(), 0, 0, 0, 0);
};

// Дата для поля ввода. Если параметр удалось преобразрвать к дате, то возвращает строку в формате
// гггг-мм-дд, иначе возвращает параметр
const getInputDate = (date) => {
  const res = new Date(date);
  return res.toString() === 'Invalid Date'
    ? date
    : `${res.getFullYear()}-${(res.getMonth() + 1 < 10 ? '0' : '')
        + (res.getMonth() + 1)}-${(res.getDate() < 10 ? '0' : '') + res.getDate()}`;
};

export {
  getLocalDate, beginDay, endDay, agoMonth, getInputDate, beginDateZeroTime,
};
