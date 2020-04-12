const request = require('supertest');
const assert = require('assert');
const { app } = require('../index');

const testRouter = () => {
  describe('Тестирование основного роутера', () => {
    it('Тест /', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end(done);
    });
    it('Тест неверного адреса', (done) => {
      request(app)
        .get('/badPath')
        .expect(404)
        .end(done);
    });
  });
};

const testRouterAPI = () => {
  describe('Тестирование API', () => {
    it('Добавление action без параметров', (done) => {
      request(app)
        .post('/api/action')
        .send({})
        .expect(400)
        .end(done);
    });
    it('Добавление action с пустым объектом', (done) => {
      request(app)
        .post('/api/action')
        .send()
        .expect(400)
        .end(done);
    });
    it('Добавление action без одного параметра', (done) => {
      request(app)
        .post('/api/action')
        .send({
          date: new Date(),
          number: '123',
          issuingAuthority: 'Судом',
          article: 'ст.123',
          comment: 'Комментарий',
        })
        .expect(400)
        .end(done);
    });
    it('Добавление нового action', (done) => {
      request(app)
        .post('/api/action')
        .send({
          date: new Date(),
          number: '123',
          issuingAuthority: 'Судом',
          accused: 'Иванов Иван Иванович',
          article: 'ст.123',
          comment: 'Комментарий',
        })
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text).number, '123');
          done();
        });
    });
    it('Редактирование action', (done) => {
      request(app)
        .post('/api/action')
        .send({
          date: new Date(),
          number: '123',
          issuingAuthority: 'Главным судом',
          accused: 'Иванов Иван Иванович',
          article: 'ст.123',
          comment: 'Комментарий',
        })
        .expect(200)
        .then((response) => {
          const id = JSON.parse(response.text)._id;
          request(app)
            .post('/api/action')
            .send({
              date: new Date(),
              number: '444',
              issuingAuthority: 'Верховны Судом',
              accused: 'Иванов Иван Иванович',
              article: 'ст.123',
              comment: 'Комментарий',
              id,
            })
            .expect(200)
            .then((editResponse) => {
              assert.equal(JSON.parse(editResponse.text).number, '444');
              done();
            });
        });
    });
    it('Получение actions без параметров', (done) => {
      request(app)
        .post('/api/actions')
        .send()
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].number, '444');
          done();
        });
    });
    it('Получение actions с пустым параметром', (done) => {
      request(app)
        .post('/api/actions')
        .send({})
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].number, '444');
          done();
        });
    });
    it('Получение actions с отбором', (done) => {
      request(app)
        .post('/api/actions')
        .send({ filter: { number: '444' } })
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text).length, 1);
          done();
        });
    });
    it('Получение одного action без id', (done) => {
      request(app)
        .post('/api/oneAction')
        .send()
        .expect(400)
        .end(done);
    });
    it('Получение одного action с id', (done) => {
      request(app)
        .post('/api/actions')
        .send()
        .expect(200)
        .then((response) => {
          const { id } = JSON.parse(response.text)[0];
          request(app)
            .post('/api/oneAction')
            .send({ id })
            .expect(200)
            .then((responseOneAction) => {
              assert.equal(JSON.parse(responseOneAction.text).id, id);
              done();
            });
        });
    });

    it('Добавление order без параметров', (done) => {
      request(app)
        .post('/api/order')
        .send({})
        .expect(400)
        .end(done);
    });
    it('Добавление order с пустым объектом', (done) => {
      request(app)
        .post('/api/order')
        .send()
        .expect(400)
        .end(done);
    });
    it('Добавление order без одного параметра', (done) => {
      request(app)
        .post('/api/order')
        .send({
          date: new Date(),
          number: '123',
          jurist: 'Сидоров Илья Сидорович',
          article: 'ст.123',
          comment: 'Комментарий',
        })
        .expect(400)
        .end(done);
    });
    it('Добавление нового order', (done) => {
      request(app)
        .post('/api/actions')
        .send({})
        .then((response) => {
          const { id } = JSON.parse(response.text)[0];
          request(app)
            .post('/api/order')
            .send({
              date: new Date(),
              number: '567',
              jurist: 'Сидоров Илья Сидорович',
              comment: 'Комментарий',
              action: id,
            })
            .expect(200)
            .then((responseOrder) => {
              assert.equal(JSON.parse(responseOrder.text).number, '567');
              done();
            });
        });
    });
    it('Редактирование order', (done) => {
      request(app)
        .post('/api/orders')
        .send({})
        .expect(200)
        .then((response) => {
          const id = JSON.parse(response.text)[0]._id;
          request(app)
            .post('/api/order')
            .send({
              date: new Date(),
              number: '888',
              comment: 'Комментарий',
              id,
            })
            .expect(200)
            .then((editResponse) => {
              assert.equal(JSON.parse(editResponse.text).number, '888');
              done();
            });
        });
    });
    it('Получение orders без параметров', (done) => {
      request(app)
        .post('/api/orders')
        .send()
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].number, '888');
          done();
        });
    });
    it('Получение orders с пустым параметром', (done) => {
      request(app)
        .post('/api/orders')
        .send({})
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].number, '888');
          done();
        });
    });
    it('Получение orders с отбором', (done) => {
      request(app)
        .post('/api/orders')
        .send({ filter: { number: '888' } })
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text).length, 1);
          done();
        });
    });
    it('Получение одного order без id', (done) => {
      request(app)
        .post('/api/oneOrder')
        .send()
        .expect(400)
        .end(done);
    });
    it('Получение одного order с id', (done) => {
      request(app)
        .post('/api/orders')
        .send()
        .expect(200)
        .then((response) => {
          const { _id: id } = JSON.parse(response.text)[0];
          request(app)
            .post('/api/oneOrder')
            .send({ id })
            .expect(200)
            .then((responseOneOrder) => {
              assert.equal(JSON.parse(responseOneOrder.text)._id, id);
              done();
            });
        });
    });
    it('Получение action с фильтрацией по адвокату', (done) => {
      request(app)
        .post('/api/actions')
        .send({ filter: { jurist: 'Сидоров' } })
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].number, '444');
          done();
        });
    });
    it('Получение action с фильтрацией по порядковому номеру', (done) => {
      request(app)
        .post('/api/actions')
        .send({ filter: { creationNumber: 16 } })
        .expect(200)
        .then((response) => {
          assert.equal(JSON.parse(response.text)[0].creationNumber, 16);
          assert.equal(JSON.parse(response.text).length, 1);
          done();
        });
    });
    it('Получение action с несколькими ордерами', (done) => {
      request(app)
        .post('/api/actions')
        .send({ filter: { creationNumber: '16' } })
        .expect(200)
        .then((response) => {
          const action = JSON.parse(response.text)[0];
          assert.deepEqual(
            {
              order1: action.orders[0].creationNumber,
              order2: action.orders[1].creationNumber,
            },
            { order1: 9, order2: 8 },
          );
          done();
        });
    });
    it('Получение excel по одному делу', (done) => {
      request(app)
        .post('/api/actions')
        .send({})
        .then((response) => {
          const { id } = JSON.parse(response.text)[0];
          request(app)
            .post('/api/excelAction')
            .send({ id })
            .expect(200)
            .then((responseExcel) => {
              assert.equal(JSON.parse(responseExcel.text).result, true);
              done();
            });
        });
    });
    it('Получение excel по списку дел', (done) => {
      request(app)
        .post('/api/excelActions')
        .send({ filter: { creationNumber: 10 } })
        .then((responseExcel) => {
          assert.equal(JSON.parse(responseExcel.text).result, true);
          done();
        });
    });
  });
};

module.exports = { testRouter, testRouterAPI };
