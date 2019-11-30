import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const { expect } = chai;
chai.use(chaiHttp);

// get test user token
const params = {
  email: "test@test.com",
  password: "testpassword",
};

describe("Article end point", () => {
  let token;
  let userId;
  let testArticleId;

  before(
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
          email: params.email,
          password: params.password,
        });
      token = response.body.data.token;
      userId = response.body.data.userId;
    },
  );


  it("should creates an article",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "title",
          article: "article body",
          fkUserId: userId,
          createdOn: new Date().toString(),
        });
      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("article");
      testArticleId = response.body.data.id;
    });

  it("should returns all articles",
    async () => {
      const response = await chai.request(app)
        .get("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });

  it("should returns an article by id",
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles/${testArticleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("article");
    });

  it("should edit an article",
    async () => {
      const response = await chai.request(app)
        .patch(`/api/v1/articles/${testArticleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          id: testArticleId,
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
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });
});
