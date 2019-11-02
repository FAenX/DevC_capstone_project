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

const normalUser = {
  firstName: "firstName",
  lastName: "lastName",
  userName: "userName",
  email: makeEmail(),
  password: "password",
  isStaff: false,
};


let createdUserId = null;
let token = null;

describe("Users end point", () => {
  it("creates a normal user if request sent by staff", (done) => {
    chai
      .request(app)
      .post("/api/v1/users")
      .set("Authorization", "Staff true")
      .send(normalUser)
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

  it("refuses to create user if request sent by non staff", (done) => {
    chai
      .request(app)
      .post("/api/v1/users")
      .set("Authorization", "Staff false")
      .send(normalUser)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(401);
        expect(res.body.status).to.equals("error");
        expect(res.body.error).to.equals("access denied");
        done();
      });
  });


  it("gets a user token", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/token")
      .send({
        email: normalUser.email,
        password: normalUser.password,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.data.userId).to.equals(normalUser.email);
        expect(res.body.data.token).is.a("string");
        token = res.body.data.token;
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
        expect(res.body.status).to.equals("success");
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
        expect(res.body.data[0].id).to.equals(createdUserId);
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
        expect(res.body.status).to.equals("success");
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
        expect(res.body.status).to.equals("success");
        done();
      });
  });
});
