import chai from "chai";
import chaiHttp from "chai-http";
import axios from "axios";
import app from "../src/app";

const { expect } = chai;
chai.use(chaiHttp);

// get test user token
const params = {
  email: "test@test.com",
  password: "test",
};


chai.request(app)
  .post("/api/v1/auth/signin/")
  .send(params)

  . then((res) => {
    const data = JSON.parse(res.text);
    const { token } = data.data;
    let testArticleId;
    describe("Article end point", () => {
      it("should creates an article",
        async () => {
          const response = await chai.request(app)
            .post("/api/v1/articles")
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`);

          expect(response).to.have.status(200);
          expect(response.body.status).to.equals("success");
        });
    });
  });
