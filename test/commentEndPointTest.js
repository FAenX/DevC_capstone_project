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

describe("Comment end point", () => {
  let token;
  let userId;
  let testCommentId;
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

  before(
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/articles")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "title",
          article: "article body",
          userId,
          createdOn: new Date().toString(),
        });
      testArticleId = response.body.data.id;
    },
  );


  it("should creates an comment",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "comment body",
          userId,
          testArticleId,
          createdOn: new Date().toString(),
        });
      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("comment");
      testCommentId = response.body.data.id;
    });

  it("should returns all comments",
    async () => {
      const response = await chai.request(app)
        .get("/api/v1/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });

  it("should returns a comment by id",
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/comments/${testCommentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("comment");
    });

  it("should edit an comment",
    async () => {
      const response = await chai.request(app)
        .patch(`/api/v1/comments/${testCommentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          id: testCommentId,
          comment: "a new body",
          userId,
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });

  it("should delete an comment",
    async () => {
      const response = await chai.request(app)
        .delete(`/api/v1/comments/${testCommentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });
});
