import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import app from "../app";


const { expect } = chai;
chai.use(chaiHttp);

describe("Gifs Endpoint", () => {
  it("should create a new gif image",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/gifs")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .field("title", "title")
        .field("gif_comment", "a very long comment")
        .field("user_id", 1)
        .attach("file",
          fs.readFileSync("/home/emmanuel/Documents/class/devCAndela/coding/capstone_project/DevC_capstone_project/backend/images/funny.jpg1572970658275.undefined"),
          "preview.png");
      expect(response.body).to.be.an("object");
      expect(response.body.status).to.equal("success");
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("user_id");
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("url");
      expect(response.body.data).to.have.property("gif_comment");
    });

  it("returns all gifs", (done) => {
    chai
      .request(app)
      .get("/api/v1/gifs")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDQxZWdkMWdkQDRiM2EzMTUyLmNvbSIsImlhdCI6MTU3Mjk3MDkxNCwiZXhwIjoxNTczMDU3MzE0fQ.A9a6QLgy2q8pDlvwDtF8CSDv5T-yXSJgWcOeXNCAvZg")
      .send()
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("success");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });

  it("returns a gif by ID",

    async () => {
      const gifId = 1;
      const res = await chai.request(app)
        .get(`/api/v1/gifs/ ${gifId}`)
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDQxZWdkMWdkQDRiM2EzMTUyLmNvbSIsImlhdCI6MTU3Mjk3MDkxNCwiZXhwIjoxNTczMDU3MzE0fQ.A9a6QLgy2q8pDlvwDtF8CSDv5T-yXSJgWcOeXNCAvZg")
        .send();

      expect(res).to.have.status(200);
      expect(res.body.status).to.equals("success");
      expect(res.body.data).to.be.an("array");
      expect(res.body.data).to.be.lengthOf(1);
    });
});
