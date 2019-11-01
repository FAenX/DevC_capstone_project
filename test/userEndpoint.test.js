import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";


const { expect } = chai;
chai.use(chaiHttp);

const makeEmail = () => {
  const strValues = "abcdefg12345";
  let strEmail = "";
  let strTmp;
  for (let i = 0; i < 10; i += 1) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
    strEmail += strTmp;
  }
  strTmp = "";
  strEmail += "@";
  for (let j = 0; j < 8; j += 1) {
    strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
    strEmail += strTmp;
  }
  strEmail += ".com";
  return strEmail;
};

const randomEmail = makeEmail();


const user = {
  first_name: "firstName",
  last_name: "lastName",
  username: "userName",
  email: randomEmail,
  password: "password",
};

let createdUserId = null;
let token = null;

describe("Users end point", () => {
  it("creates a user", (done) => {
    chai
      .request(app)
      .post("/api/v1/users")
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(202);
        expect(res.body.status).to.equals("Successful");
        expect(res.body.result.first_name).to.equals("firstName");
        createdUserId = res.body.result.id;
        done();
      });
  });

  it("logs in a user", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.userId).to.equals(user.email);
        expect(res.body.token).is.a("string");
        token = res.body.token;
        done();
      });
  });


  it("retrieves all users", (done) => {
    chai
      .request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals("Successful");
        expect(res.body.message).to.equals("Users Information retrieved");
        done();
      });
  });

  it("retrieves a single users", (done) => {
    chai
      .request(app)
      .get(`/api/v1/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body[0].id).to.equals(createdUserId);
        done();
      });
  });

  it("modifies a user", (done) => {
    chai
      .request(app)
      .patch(`/api/v1/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "another_name",
        email: "another_name",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals(`User modified with ID: ${createdUserId}`);
        done();
      });
  });

  it("deletes a user", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals(`User deleted with ID: ${createdUserId}`);
        done();
      });
  });
});
