// Функции сравнения для мемоизации.

// Сравнение для строк(Row) в списках дел и ордеров
const areEqual = (prevProp, nextProp) => {
  for (const [key] of Object.entries(prevProp.children)) {
    if (prevProp.children[key] !== nextProp.children[key]) return false;
  }
  return true;
};

// Сравнение для меню(Menu)
const areEqualMenu = (prevProp, nextProp) => prevProp.open !== nextProp.open || prevProp.type !== nextProp.type;

export { areEqual, areEqualMenu };
