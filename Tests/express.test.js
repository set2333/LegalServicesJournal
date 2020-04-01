const request = require('supertest');
const assert = require('assert');
const { app } = require('../index');

describe('Тестирование основного роутера', () => {
  it('Тест /', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
  it('Тест /orders', (done) => {
    request(app)
      .get('/orders')
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
        assert(JSON.parse(response.text).number, '123');
        done();
      });
  });
  it('Редактирование action', (done) => {
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
        const id = JSON.parse(response.text)._id;
        request(app)
          .post('/api/action')
          .send({
            date: new Date(),
            number: '444',
            issuingAuthority: 'Судом',
            accused: 'Иванов Иван Иванович',
            article: 'ст.123',
            comment: 'Комментарий',
            id,
          })
          .expect(200)
          .then((editResponse) => {
            assert(JSON.parse(editResponse.text).number, '444');
            done();
          });
      });
  });
  it('Получение actions без параметров', (done) => {
    request(app)
      .get('/api/actions')
      .send()
      .expect(200)
      .then((response) => {
        assert(JSON.parse(response.text)[0].number, '123');
        done();
      });
  });
  it('Получение actions с пустым параметром', (done) => {
    request(app)
      .get('/api/actions')
      .send({})
      .expect(200)
      .then((response) => {
        assert(JSON.parse(response.text)[0].number, '123');
        done();
      });
  });
  it('Получение actions с отбором', (done) => {
    request(app)
      .get('/api/actions')
      .send({ number: '444' })
      .expect(200)
      .then((response) => {
        assert(JSON.parse(response.text).length, 1);
        done();
      });
  });
  it('Получение одного action без id', (done) => {
    request(app)
      .get('/api/action')
      .send()
      .expect(400)
      .end(done);
  });
  it('Получение одного action с id', (done) => {
    request(app)
      .get('/api/actions')
      .send()
      .expect(200)
      .then((response) => {
        const { _id: id } = JSON.parse(response.text)[0];
        request(app)
          .get('/api/action')
          .send({ id })
          .expect(200)
          .then((responseOneAction) => {
            assert(JSON.parse(responseOneAction.text)._id, id);
            done();
          });
      });
  });
});
