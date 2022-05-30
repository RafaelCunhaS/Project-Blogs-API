const chai = require('chai');
const { stub } = require('sinon');
const chaiHttp = require('chai-http');
const { User } = require('../src/database/models');
const { User: userMock } = require('./mocks');

chai.use(chaiHttp);

const { expect } = chai;

const app = require('../src/api');

describe('Rota /user', () => {

  before(() => {
    stub(User, 'create').callsFake(userMock.create);
    stub(User, 'findAll').callsFake(userMock.findAll);
    stub(User, 'findOne').callsFake(userMock.findOne);
    stub(User, 'findByPk').callsFake(userMock.findById);
    stub(User, 'destroy').callsFake(userMock.remove);
  });

  after(() => {
    User.create.restore();
    User.findAll.restore();
    User.findOne.restore();
    User.findByPk.restore();
    User.destroy.restore();
  });

  describe('testa o verbo GET para consultar a lista de usuários', () => {
    describe('caso não haja um token no header', () => {
      let response;

      before(async () => {
        response = await chai
          .request(app)
          .get('/user')
      });

      it('deve retornar código de status 401', () => {
        expect(response).to.have.status(401);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro "Token not found"', () => {
        expect(response.body.message).to.be.equal('Token not found');
      });
    });

    describe('caso o usuário não possua um token válido', () => {
      let response;

      before(async () => {
        const { body } = await chai.request(app).post('/login').send({
          email: "exemplo@gmail.com",
          password: "123321"
        });
        response = await chai
          .request(app)
          .get('/user')
          .set('authorization', body)
      });

      it('deve retornar código de status 401', () => {
        expect(response).to.have.status(401);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro "Expired or invalid token"', () => {
        expect(response.body.message).to.be.equal('Expired or invalid token');
      });
    });

    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;

      before(async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai
          .request(app)
          .get('/user')
          .set('authorization', token)
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });

      it('traz uma lista inicial contendo dois registros de usuários', () => {
        expect(response.body).to.have.length(2);
      });
    });
  });

  describe('testa o verbo POST', () => {
    describe('caso o usuário não passe todas as informações necessárias', () => {
      let response;

      before( async () => {
        response = await chai.request(app).post('/user').send({
          displayName: "",
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
      });

      it('deve retornar código de status 400', () => {
        expect(response).to.have.status(400);
      })
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro específica de acordo com o erro', () => {
        expect(response.body.message).to.be.equal('"displayName" is not allowed to be empty');
      });
    })
    describe('caso o usuário já exista no BD', () => {
      let response;

      before( async () => {
        response = await chai.request(app).post('/user').send({
          displayName: "Lewis Hamilton",
          email: "lewishamilton@gmail.com",
          password: "123456"
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
      it('o objeto deve possuir uma menssagem de erro "User already registered"', () => {
        expect(response.body.message).to.be.equal('User already registered');
      });
    });

    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;
      let firstList;
      let secondList;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        firstList = await chai.request(app).get('/user').set('authorization', token);
        response = await chai.request(app).post('/user').send({
          displayName: "Brett Wiltshire",
          email: "brett@email.com",
          password: "123456"
        });
        secondList = await chai.request(app).get('/user').set('authorization', token);
      });

      it('deve retornar código de status 201', () => {
        expect(response).to.have.status(201);
      });
      it('a primeira requisição GET deve retornar uma lista com 2 objetos', () => {
        expect(firstList.body).to.have.length(2);
      });
      it('a segunda requisição GET deve retornar uma lista com 3 objetos', () => {
        expect(secondList.body).to.have.length(3);
      });
      it('o corpo da resposta deve ser um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "token"', () => {
        expect(response.body).to.have.key('token');
      });
    });
  });

  describe('testa o verbo GET para a rota /user/:id', () => {
    describe('caso não exista o usuário no BD', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).get('/user/9999').set('authorization', token);
      })

      it('deve retornar código de status 404', () => {
        expect(response).to.have.status(404);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir a chave "message"', () => {
        expect(response.body).to.have.key('message');
      });
      it('o objeto deve possuir uma menssagem de erro "User does not exist"', () => {
        expect(response.body.message).to.be.equal('User does not exist');
      });
    });

    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).get('/user/2').set('authorization', token);
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });
      it('o corpo da resposta deve ser um objeto', () => {
        expect(response.body).to.be.a('object');
      });
      it('o objeto deve possuir as informações do usuário encontrado sem o password', () => {
        expect(response.body).to.be.eql({
          "id": 2,
          "displayName": "Michael Schumacher",
          "email": "MichaelSchumacher@gmail.com",
          "image": "https://sportbuzz.uol.com.br/media/_versions/gettyimages-52491565_widelg.jpg"
        });
      });
    });
  });

  describe('testa o verbo DELETE na rota /user/me', () => {
    describe('remove o usuário do BD', () => {
      let response;
      let firstList;
      let secondList;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        firstList = await chai.request(app).get('/user').set('authorization', token);
        response = await chai.request(app).delete('/user/me').set('authorization', token);
        secondList = await chai.request(app).get('/user').set('authorization', token);
      })

      it('deve retornar código de status 204', () => {
        expect(response).to.have.status(204);
      });
      it('a primeira requisição GET deve retornar uma lista com 2 objetos', () => {
        console.log(firstList.body);
        expect(firstList.body).to.have.length(3);
      });
      it('a segunda requisição GET deve retornar uma lista com 1 objetos', () => {
        expect(secondList.body).to.have.length(2);
      });
      it('não deve haver nenhum retorno do corpo', () => {
        expect(response.body).to.not.have.length;
      });
    });
  })
});