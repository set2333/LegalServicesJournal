const mongoose = require('mongoose');
const assert = require('assert');
const { Action, Order } = require('../serverModules/mongoModules/mongooseSchema');

const {
  addAction,
  getOneAction,
  getMaxNumberAction,
  addOrder,
  getOneOrder,
  getMaxNumberOrder,
  getActions,
  getOrders,
} = require('../serverModules/mongoModules/mongoFunctions');

mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  async (err) => {
    if (err) return console.log(err);
    Action.collection.drop();
    Order.collection.drop();
    setTimeout(() => mongoose.disconnect(), 1000);
  },
);

describe('TEST: module mongoFunction.js', () => {
  it('getMaxNumberAction без докуменов', (done) => {
    getMaxNumberAction().then((result) => {
      assert.equal(result, 0);
      done();
    });
  });

  it('getOneAction без параметров', (done) => {
    getOneAction().then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('getOneAction с неверным id', (done) => {
    getOneAction('123456789').then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('getOneAction с верным id', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
      comment: 'Комментарий',
    }).then(({ _id }) => {
      getOneAction(_id).then((result) => {
        assert.equal(result.number, '123');
        done();
      });
    });
  });

  it('addAction без параметров', (done) => {
    addAction({}).then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('addAction с пустым объектом', (done) => {
    addAction({}).then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('addAction без id', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
      comment: 'Комментарий',
    }).then((result) => {
      assert.deepEqual(
        { date: result.date, number: result.number },
        {
          date: testDate,
          number: '123',
        },
      );
      done();
    });
  });

  it('addAction без id и комментария', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
    }).then((result) => {
      assert.deepEqual(
        { date: result.date, number: result.number },
        {
          date: testDate,
          number: '123',
        },
      );
      done();
    });
  });

  it('addAction с id и всеми параметрами', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
      comment: 'Комментарий',
    }).then(({ _id }) => {
      addAction({
        id: _id,
        date: testDate,
        number: '456',
        issuingAuthority: 'Судом',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
      }).then(() => {
        getOneAction(_id).then((result) => {
          assert.equal(result.number, '456');
          done();
        });
      });
    });
  });

  it('addAction с id и новым номером', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'Комментарий',
    }).then(({ _id }) => {
      addAction({
        id: _id,
        number: '789',
      }).then(() => {
        getOneAction(_id).then((result) => {
          assert.deepEqual(
            { number: result.number, article: result.article },
            { number: '789', article: 'ст.789' },
          );
          done();
        });
      });
    });
  });

  it('addAction с id и без параметров', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'Комментарий',
    }).then((newAction) => {
      addAction({
        id: newAction._id,
      }).then(() => {
        getOneAction(newAction._id).then((result) => {
          assert.deepEqual(
            { creationDate: result.creationDate, id: result.id },
            { creationDate: newAction.creationDate, id: newAction.id },
          );
          done();
        });
      });
    });
  });

  it('addAction редактирование дела без комментария', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
    }).then((newAction) => {
      addAction({
        id: newAction._id,
        number: '556',
      }).then(() => {
        getOneAction(newAction._id).then((result) => {
          assert.equal(result.number, '556');
          done();
        });
      });
    });
  });

  it('getMaxNumberAction с документами', (done) => {
    getMaxNumberAction().then((result) => {
      assert.equal(result, 7);
      done();
    });
  });

  it('Проверка автонумерации документов', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'другой комментарий',
    }).then((result) => {
      assert.equal(result.creationNumber, 8);
      done();
    });
  });

  it('getActions без параметров', (done) => {
    getActions().then((result) => {
      assert.equal(result.length, 8);
      done();
    });
  });

  it('getActions с номером в параметрах', (done) => {
    getActions(new Date(2000, 0, 1), new Date(3000, 0, 1), { number: '456' }).then((result) => {
      assert.equal(result.length, 1);
      done();
    });
  });

  it('getActions с номером и комментарием в параметрах', (done) => {
    getActions(new Date(2000, 0, 1), new Date(3000, 0, 1), {
      number: '123',
      comment: 'другой комментарий',
    }).then((result) => {
      assert.equal(result.length, 1);
      done();
    });
  });

  it('getActions проверка сортировки', (done) => {
    getActions().then((result) => {
      assert.deepEqual(
        { max: result[0].creationNumber, min: result[6].creationNumber },
        { max: 8, min: 2 },
      );
      done();
    });
  });

  it('getMaxNumberOrder без докуменов', (done) => {
    getMaxNumberOrder().then((result) => {
      assert.equal(result, 0);
      done();
    });
  });

  it('getOneOrder без параметров', (done) => {
    getOneOrder().then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('getOneOrder с неверным id', (done) => {
    getOneOrder('123456789').then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('getOneOrder с верным id', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
      comment: 'Комментарий',
    }).then(({ id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Петр Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
        action: id,
      }).then(({ id: orderId }) => {
        getOneOrder(orderId).then((result) => {
          assert.deepEqual(
            { date: result.date, number: result.number },
            {
              date: testDate,
              number: '123',
            },
          );
          done();
        });
      });
    });
  });

  it('addOrder без параметров', (done) => {
    addOrder({}).then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('addOrder с пустым объектом', (done) => {
    addOrder({}).then((result) => {
      assert.equal(result, null);
      done();
    });
  });

  it('addOrder без id', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
      comment: 'Комментарий',
    }).then(({ id }) => {
      addOrder({
        date: testDate,
        number: '147',
        jurist: 'Петров Петр Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
        action: id,
      }).then((result) => {
        assert.deepEqual(
          { date: result.date, number: result.number },
          {
            date: testDate,
            number: '147',
          },
        );
        done();
      });
    });
  });

  it('addOrder без id и комментария', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
    }).then(({ id }) => {
      addOrder({
        date: testDate,
        number: '258',
        jurist: 'Петров Петр Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        action: id,
      }).then((result) => {
        assert.deepEqual(
          { date: result.date, number: result.number },
          {
            date: testDate,
            number: '258',
          },
        );
        done();
      });
    });
  });

  it('addOrder с id и всеми параметрами', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
    }).then(({ _id: id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Пер Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
        action: id,
      }).then(({ _id }) => {
        addOrder({
          id: _id,
          date: testDate,
          number: '456',
          issuingAuthority: 'Судом',
          accused: 'Иванов Иван Иванович',
          article: 'ст.123',
          comment: 'Комментарий',
          action: id,
        }).then(() => {
          getOneOrder(_id).then((result) => {
            assert.equal(result.number, '456');
            done();
          });
        });
      });
    });
  });

  it('addOrder с id и новым номером', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
    }).then(({ _id: id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Пер Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
        action: id,
      }).then(({ _id }) => {
        addOrder({
          id: _id,
          number: '369',
        }).then(() => {
          getOneOrder(_id).then((result) => {
            assert.equal(result.number, '369');
            done();
          });
        });
      });
    });
  });

  it('addOrder с id и без параметров', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.123',
    }).then(({ _id: id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Пер Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'Комментарий',
        action: id,
      }).then((newOrder) => {
        addOrder({
          id: newOrder._id,
        }).then(({ _id }) => {
          getOneOrder(_id).then((result) => {
            assert.deepEqual(
              { creationDate: result.creationDate, id: result.id },
              { creationDate: newOrder.creationDate, id: newOrder.id },
            );
            done();
          });
        });
      });
    });
  });

  it('getMaxNumberOrder с документами', (done) => {
    getMaxNumberOrder().then((result) => {
      assert.equal(result, 6);
      done();
    });
  });

  it('Проверка автонумерации ордеров', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'Комментарий',
    }).then(({ id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Пер Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'другой комментарий',
        action: id,
      }).then((result) => {
        assert.equal(result.creationNumber, 7);
        done();
      });
    });
  });

  it('getOrders без параметров', (done) => {
    getOrders().then((result) => {
      assert.equal(result.length, 7);
      done();
    });
  });

  it('getOrders с номером в параметрах', (done) => {
    getOrders(new Date(2000, 0, 1), new Date(3000, 0, 1), { number: '456' }).then((result) => {
      assert.equal(result.length, 1);
      done();
    });
  });

  it('getOrders с номером и комментарием в параметрах', (done) => {
    getOrders(new Date(2000, 0, 1), new Date(3000, 0, 1), {
      number: '123',
      comment: 'другой комментарий',
    }).then((result) => {
      assert.equal(result.length, 1);
      done();
    });
  });

  it('getOrders проверка сортировки', (done) => {
    getOrders().then((result) => {
      assert.deepEqual(
        { max: result[0].creationNumber, min: result[6].creationNumber },
        { max: 7, min: 1 },
      );
      done();
    });
  });

  it('getOrders по делу', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'Комментарий',
    }).then(({ id }) => {
      addOrder({
        date: testDate,
        number: '123',
        jurist: 'Петров Пер Петрович',
        accused: 'Иванов Иван Иванович',
        article: 'ст.123',
        comment: 'другой комментарий',
        action: id,
      }).then(() => {
        addOrder({
          date: testDate,
          number: '123',
          jurist: 'Петров Пер Петрович',
          accused: 'Иванов Иван Иванович',
          article: 'ст.123',
          comment: 'другой комментарий',
          action: id,
        }).then(() => {
          getOrders(new Date(2000, 0, 1), new Date(3000, 0, 1), { action: id }).then((result) => {
            assert.equal(result.length, 2);
            done();
          });
        });
      });
    });
  });
});
