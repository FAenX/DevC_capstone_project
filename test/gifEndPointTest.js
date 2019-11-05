import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";


const { expect } = chai;
chai.use(chaiHttp);

describe("Users end point", () => {
  it("returns a gif image by id", (done) => {
    chai
      .request(app)
      .get("/api/v1/gif")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDQxZWdkMWdkQDRiM2EzMTUyLmNvbSIsImlhdCI6MTU3Mjk3MDkxNCwiZXhwIjoxNTczMDU3MzE0fQ.A9a6QLgy2q8pDlvwDtF8CSDv5T-yXSJgWcOeXNCAvZg")
      .send()
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(202);
        expect(res.body.status).to.equals("success");
        expect(res.body.data.first_name).to.equals("firstName");
        createdUserId = res.body.data.id;
        done();
      });
  });
});
