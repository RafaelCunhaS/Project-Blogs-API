const chai = require('chai');
const { stub } = require('sinon');
const chaiHttp = require('chai-http');
const { Category, User } = require('../src/database/models');
const { Category: categoryMock, User: userMock } = require('./mocks');

chai.use(chaiHttp);

const { expect } = chai;

const app = require('../src/api');

describe('Rota /categories', () => {

  before(() => {
    stub(Category, 'findAll').callsFake(categoryMock.findAll);
    stub(Category, 'findOne').callsFake(categoryMock.findOne);
    stub(Category, 'create').callsFake(categoryMock.create);
    stub(User, 'findOne').callsFake(userMock.findOne);
  });

  after(() => {
    Category.findAll.restore();
    Category.findOne.restore();
    Category.create.restore();
    User.findOne.restore();
  });

  describe('testa o verbo GET', () => {
    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).get('/categories').set('authorization', token);
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });
      it('o corpo da resposta deve ser um array', () => {
        expect(response.body).to.be.an('array');
      });
      it('o objeto deve possuir uma lista com todas as categorias', () => {
        expect(response.body).to.be.eql([
          {
            "id": 1,
            "name": "Inovação"
          },
          {
            "id": 2,
            "name": "Escola"
          }
        ]);
      });
    });
  });

  describe('testa o verbo POST', () => {
    describe('caso não exista o nome da categoria na requisição', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/categories').set('authorization', token);
      });

      it('deve retornar código de status 400', () => {
        expect(response).to.have.status(400);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro ""name" is required"', () => {
        expect(response.body.message).to.be.equal('"name" is required');
      });
    });

    describe('caso já exista a categoria no BD', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/categories').set('authorization', token).send({
          name: "Inovação"
        });
      });

      it('deve retornar código de status 409', () => {
        expect(response).to.have.status(409);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro "Category already registered"', () => {
        expect(response.body.message).to.be.equal('Category already registered');
      });
    });

    describe('caso a criação seja resolvida com sucesso', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/categories').set('authorization', token).send({
          name: "Categoria"
        });
      });

      it('deve retornar código de status 201', () => {
        expect(response).to.have.status(201);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir as chaves "id" e "name"', () => {
        expect(response.body).to.have.all.keys('id', 'name');
      });
    });
  });
});