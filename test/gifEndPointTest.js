import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import fetch from "node-fetch";
import app from "../src/app";


const { expect } = chai;
chai.use(chaiHttp);


const currentPath = process.cwd();

// get test user token
const params = {
  email: "test@test.com",
  password: "testpassword",
};


describe("Gifs Endpoint ", () => {
  let token;
  let userId;
  let gifId;

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


  it("should create a new gif image",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/gifs")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("Authorization", `Bearer ${token}`)
        .field("title", "title")
        .field("userId", userId)
        .field("createdOn", new Date().toString())
        .attach("file",
          fs.readFileSync(`${currentPath}/test/image.png`),
          "preview.png");
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.have.property("gifUrl");
      gifId = response.body.data.id;
    });

  it("should returns all gifs",

    async () => {
      const response = await chai.request(app)
        .get("/api/v1/gifs")
        .set("Authorization", `Bearer ${token}`)
        .send();
      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });


  it("should return a gif by ID",

    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/gifs/ ${gifId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });

  it("should delete a gif",
    async () => {
      const response = await chai.request(app)
        .delete(`/api/v1/gifs/${gifId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });
});
