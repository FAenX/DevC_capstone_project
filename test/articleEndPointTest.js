import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import app from "../src/app";

const { expect } = chai;
chai.use(chaiHttp);

// get test user token
const host = "http://127.0.0.1:3001/";
const signinUrl = `${host}api/v1/auth/signin/`;
const params = {
  email: "test@test.com",
  password: "test",
};

const getToken = () => axios.post(signinUrl, params)
  .then((res) => {
    const { token, userId, email } = res.data.data;
    return { token, userId, email };
  })
  .catch((error) => console.log(error));

getToken().then((data) => {
  let testArticleId;
  describe("Article end point", () => {
    it("should creates an article",
      async () => {
        const response = await chai.request(app)
          .post("/api/v1/articles")
          .set("Authorization", `Bearer ${data.token}`)
          .send({
            title: "title",
            article: "article body",
            userId: data.email,
            fkUserId: data.userId,
            createdOn: new Date().toString(),
          });

        expect(response).to.have.status(202);
        expect(response.body.status).to.equals("success");
        expect(response.body.data.message).to.equals("Article successfully posted");
        testArticleId = response.body.data.articleId;
      });

    it("should returns all articles",
      async () => {
        const response = await chai.request(app)
          .get("/api/v1/articles");

        expect(response).to.have.status(200);
        expect(response.body.status).to.equals("success");
        expect(response.body.data).to.be.an("array");
      });

    it("should returns an article by id",
      async () => {
        const response = await chai.request(app)
          .get(`/api/v1/articles/${testArticleId}`);

        expect(response).to.have.status(200);
        expect(response.body.status).to.equals("success");
        expect(response.body.data).to.have.property("title");
        expect(response.body.data).to.have.property("article");
      });

    it("should edit an article",
      async () => {
        const response = await chai.request(app)
          .patch(`/api/v1/articles/${testArticleId}`)
          .set("Authorization", `Bearer ${data.token}`)
          .send({
            title: "new title",
            article: "a new body",
          });

        expect(response).to.have.status(200);
        expect(response.body.status).to.equals("success");
        expect(response.body.data).to.have.property("title");
        expect(response.body.data).to.have.property("article");
      });

    it("should delete an article",
      async () => {
        const response = await chai.request(app)
          .delete(`/api/v1/articles/${testArticleId}`)
          .set("Authorization", `Bearer ${data.token}`);

        expect(response).to.have.status(200);
        expect(response.body.status).to.equals("success");
      });
  });
});
