import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";


const { expect } = chai;
chai.use(chaiHttp);

const user = {
  first_name: "firstName",
  last_name: "lastName",
  username: "userName",
  email: "email",
  password: "password",
};

let createdUserId = null;


describe("Users end point", () => {
  it("retrieves all users", (done) => {
    chai
      .request(app)
      .get("/api/v1/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("Successful");
        expect(res.body.message).to.equals("Users Information retrieved");
        done();
      });
  });

  it("creates a user", (done) => {
    chai
      .request(app)
      .post("/api/v1/users")
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(202);
        expect(res.body.status).to.equals("Successful");
        expect(res.body.result.first_name).to.equals("firstName");
        createdUserId = res.body.result.id;
        done();
      });
  });

  it("retrieves a single users", (done) => {
    chai
      .request(app)
      .get(`/api/v1/users/${createdUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body[0].id).to.equals(createdUserId);
        done();
      });
  });

  it("modifies a user", (done) => {
    chai
      .request(app)
      .patch(`/api/v1/users/${createdUserId}`)
      .send({
        username: "another_name",
        email: "another_name",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals(`User modified with ID: ${createdUserId}`);
        done();
      });
  });

  it("deletes a user", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals(`User deleted with ID: ${createdUserId}`);
        done();
      });
  });
});
