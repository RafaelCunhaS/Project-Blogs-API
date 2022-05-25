const chai = require('chai');
const Sequelize = require('sequelize');
const { stub } = require('sinon');
const chaiHttp = require('chai-http');
const { User, BlogPost, Category, PostCategory } = require('../src/database/models');
const { BlogPost: blogPostMock, User: userMock, Category: categoryMock } = require('./mocks');
const config = require('../src/database/config/config');

const sequelize = new Sequelize(config.development);

chai.use(chaiHttp);

const { expect } = chai;

const app = require('../src/api');

describe('Rota /post', () => {

  before(() => {
    stub(User, 'findOne').callsFake(userMock.findOne);
    stub(Category, 'findAndCountAll').callsFake(categoryMock.findAndCountAll);
    stub(PostCategory, 'bulkCreate').resolves();
    // stub(sequelize, 'transaction').resolves();
    stub(BlogPost, 'create').callsFake(blogPostMock.create);
    stub(BlogPost, 'findAll').callsFake(blogPostMock.findAll);
    stub(BlogPost, 'findByPk').callsFake(blogPostMock.findById);
    stub(BlogPost, 'update').callsFake(blogPostMock.update);
    stub(BlogPost, 'destroy').callsFake(blogPostMock.remove);
  });

  after(() => {
    User.findOne.restore();
    Category.findAndCountAll.restore();
    PostCategory.bulkCreate.restore();
    // sequelize.transaction.restore();
    BlogPost.create.restore();
    BlogPost.findAll.restore();
    BlogPost.findByPk.restore();
    BlogPost.update.restore();
    BlogPost.destroy.restore();
  });

  describe('testa o verbo GET para consultar a lista de usuários', () => {
    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;

      before(async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai
          .request(app)
          .get('/post')
          .set('authorization', token)
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });
      it('o corpo deve retornar um array', () => {
        expect(response.body).to.be.an('array');
      });
      it('traz uma lista inicial contendo dois registros de posts', () => {
        expect(response.body).to.have.length(2);
      });
    });
    describe('testa a rota /post/search com uma query pra pesquisa', () => {
      let response;

      before(async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai
          .request(app)
          .get('/post/search?q=vamos')
          .set('authorization', token)
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });
      it('o corpo deve retornar um array', () => {
        expect(response.body).to.be.an('array');
      });
      it('traz uma lista contendo os posts que contém a query de pesquisa em seu título ou conteúdo', () => {
        expect(response.body).to.have.length(1);
      });
    });
    describe('testa a rota /post/:id para buscar um post específico', () => {
      describe('caso o post não exista no BD', () => {
        let response;

        before(async () => {
          const { body: { token } } = await chai.request(app).post('/login').send({
            email: "lewishamilton@gmail.com",
            password: "123456"
          });
          response = await chai
            .request(app)
            .get('/post/9999')
            .set('authorization', token)
        });

        it('deve retornar código de status 404', () => {
          expect(response).to.have.status(404);
        });
        it('o corpo deve retornar um objeto', () => {
          expect(response.body).to.be.an('object');
        });
        it('o objeto deve possuir a chave "message"', () => {
          expect(response.body).to.have.all.keys('message');
        });
        it('o objeto deve possuir uma menssagem de erro "Post does not exist"', () => {
          expect(response.body.message).to.be.equal('Post does not exist');
        });
      });
      describe('caso o post exista no BD', () => {
        let response;

        before(async () => {
          const { body: { token } } = await chai.request(app).post('/login').send({
            email: "lewishamilton@gmail.com",
            password: "123456"
          });
          response = await chai
            .request(app)
            .get('/post/2')
            .set('authorization', token)
        });

        it('deve retornar código de status 200', () => {
          expect(response).to.have.status(200);
        });
        it('o corpo deve retornar um objeto', () => {
          expect(response.body).to.be.a('object');
        });
      });
    });
  });

  describe('testa o verbo POST', () => {
    describe('caso o usuário não passe todas as informações necessárias', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/post').set('authorization', token).send({
          title: "exemplo de título",
          content: "exemplo de texto",
          categoryIds: []
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
      it('o objeto deve possuir uma menssagem de erro "Some required fields are missing"', () => {
        expect(response.body.message).to.be.equal('Some required fields are missing');
      });
    })
    describe('caso alguma categoria não exista no BD', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/post').set('authorization', token).send({
          title: "exemplo de título",
          content: "exemplo de texto",
          categoryIds: [1, 9999]
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
      it('o objeto deve possuir uma menssagem de erro ""categoryIds" not found"', () => {
        expect(response.body.message).to.be.equal('"categoryIds" not found');
      });
    });

    describe('caso a requisição seja resolvida com sucesso', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).post('/post').set('authorization', token).send({
          title: "exemplo de título",
          content: "exemplo de texto",
          categoryIds: [1, 2]
        });
      });

      it('deve retornar código de status 201', () => {
        expect(response).to.have.status(201);
      });
      it('o corpo da resposta deve ser um objeto', () => {
        expect(response.body).to.be.a('object');
      });
    });
  });

  describe('testa o verbo PUT para a rota /post/:id', () => {
    describe('caso todas informções de atualização não forem fornecidas', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).put('/post/1').set('authorization', token).send({
          title: "exemplo de título",
          content: ""
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
      it('o objeto deve possuir uma menssagem de erro "Some required fields are missing"', () => {
        expect(response.body.message).to.be.equal('Some required fields are missing');
      });
    });

    describe('caso o usuário não tiver permissão para atualizar o post', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "MichaelSchumacher@gmail.com",
          password: "987789"
        });
        response = await chai.request(app).put('/post/1').set('authorization', token).send({
          title: "exemplo de título",
          content: "exemplo de texto"
        });
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
      it('o objeto deve possuir uma menssagem de erro "Unauthorized user"', () => {
        expect(response.body.message).to.be.equal('Unauthorized user');
      });
    });

    describe('caso a atualização ocorra com sucesso', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).put('/post/1').set('authorization', token).send({
          title: "exemplo de título",
          content: "exemplo de texto"
        });
      });

      it('deve retornar código de status 200', () => {
        expect(response).to.have.status(200);
      });
      it('o corpo deve retornar um objeto', () => {
        expect(response.body).to.be.a('object');
      });
    });
  });

  describe('testa o verbo DELETE na rota /post/:id', () => {
    describe('remove o usuário do BD', () => {
      let response;

      before( async () => {
        const { body: { token } } = await chai.request(app).post('/login').send({
          email: "lewishamilton@gmail.com",
          password: "123456"
        });
        response = await chai.request(app).delete('/post/1').set('authorization', token);
      })

      it('deve retornar código de status 204', () => {
        expect(response).to.have.status(204);
      });
      it('não deve haver nenhum retorno do corpo', () => {
        expect(response.body).to.not.have.length;
      });
    });
  })
});