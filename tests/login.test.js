const chai = require('chai');
const { stub } = require('sinon');
const chaiHttp = require('chai-http');
const { User } = require('../src/database/models');
const { User: userMock } = require('./mocks');

chai.use(chaiHttp);

const { expect } = chai;

const app = require('../src/api');

describe('Rota POST /login', () => {

  before(() => stub(User, 'findOne').callsFake(userMock.findOne));

  after(() => User.findOne.restore());

  describe('caso todas informações não forem passadas corretamente', () => {
    let response;

    before( async () => {
      response = await chai.request(app).post('/login').send({
        email: "exemplo@gmail.com",
        password: ""
      });
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
    it('o objeto deve possuir uma menssagem de erro "Some required fields are missing"', () => {
      expect(response.body.message).to.be.equal('Some required fields are missing');
    });
  });

  describe('caso o usuário não exista no BD', () => {
    let response;

    before( async () => {
      response = await chai.request(app).post('/login').send({
        email: "exemplo@gmail.com",
        password: "123321"
      });
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
    it('o objeto deve possuir uma menssagem de erro "Invalid fields"', () => {
      expect(response.body.message).to.be.equal('Invalid fields');
    });
  });

  describe('caso a requisição seja resolvida com sucesso', () => {
    let response;

    before( async () => {
      response = await chai.request(app).post('/login').send({
        email: "lewishamilton@gmail.com",
        password: "123456"
      });
    });

    it('deve retornar código de status 200', () => {
      expect(response).to.have.status(200);
    });
    it('o corpo da resposta deve ser um objeto', () => {
      expect(response.body).to.be.a('object');
    });
    it('o objeto deve possuir a chave "token"', () => {
      expect(response.body).to.have.key('token');
    });
  });
});