const mongoose = require('mongoose');
const assert = require('assert');
const { Action } = require('../serverModules/mongoModules/mongooseSchema');

const {
  addAction,
  getOneAction,
  getMaxNumberAction,
} = require('../serverModules/mongoModules/mongoFunctions');

mongoose.connect(
  'mongodb://localhost:27017/juristjournal',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  async (err) => {
    if (err) return console.log(err);
    Action.collection.drop();
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

  it('getMaxNumberAction с документами', (done) => {
    getMaxNumberAction().then((result) => {
      assert.equal(result, 6);
      done();
    });
  });

  it('Проверка автонумерации', (done) => {
    const testDate = new Date();
    addAction({
      date: testDate,
      number: '123',
      issuingAuthority: 'Судом',
      accused: 'Иванов Иван Иванович',
      article: 'ст.789',
      comment: 'Комментарий',
    }).then((result) => {
      assert.equal(result.creationNumber, 7);
      done();
    });
  });
});
