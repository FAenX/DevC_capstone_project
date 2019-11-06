import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import app from "../app";


const { expect } = chai;
chai.use(chaiHttp);

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDQxZWdkMWdkQDRiM2EzMTUyLmNvbSIsImlhdCI6MTU3Mjk3MDkxNCwiZXhwIjoxNTczMDU3MzE0fQ.A9a6QLgy2q8pDlvwDtF8CSDv5T-yXSJgWcOeXNCAvZg";
let gifId;
const currentPath = process.cwd();

describe("Gifs Endpoint ", () => {
  it("should create a new gif image",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/gifs")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .field("title", "title")
        .field("comment", "a very long comment")
        .field("userId", 1)
        .attach("file",
          fs.readFileSync(`${currentPath}/test/image.png`),
          "preview.png");
      expect(response.body).to.be.an("object");
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("user_id");
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("url");
      expect(response.body.data).to.have.property("gif_comment");
      gifId = response.body.data.id;
    });

  it("returns all gifs",
    async () => {
      const response = await chai.request(app)
        .get("/api/v1/gifs")
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDQxZWdkMWdkQDRiM2EzMTUyLmNvbSIsImlhdCI6MTU3Mjk3MDkxNCwiZXhwIjoxNTczMDU3MzE0fQ.A9a6QLgy2q8pDlvwDtF8CSDv5T-yXSJgWcOeXNCAvZg")
        .send();
      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });

  it("returns a gif by ID",

    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/gifs/ ${gifId}`)
        .set("Authorization", `Bearer ${token} `)
        .send();

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
      expect(response.body.data).to.be.lengthOf(1);
      expect(response.body.data[0]).to.have.property("id");
      expect(response.body.data[0]).to.have.property("user_id");
      expect(response.body.data[0]).to.have.property("title");
      expect(response.body.data[0]).to.have.property("url");
      expect(response.body.data[0]).to.have.property("gif_comment");
    });

  it("modifies gif user comment",
    async () => {
      const response = await chai.request(app)
        .patch(`/api/v1/gifs/${gifId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          comment: "another comment",
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });
});
