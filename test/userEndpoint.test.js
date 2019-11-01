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

const randomAdminEmail = makeEmail();
const randomUserEmail = makeEmail();


const adminUser = {
  first_name: "firstName",
  last_name: "lastName",
  username: "userName",
  email: randomAdminEmail,
  password: "password",
  is_staff: true,
};

const normalUser = {
  first_name: "firstName",
  last_name: "lastName",
  username: "userName",
  email: randomUserEmail,
  password: "password",
  is_staff: false,
};


let createdUserId = null;
const createdAdminId = null;
let token = null;

describe("Users end point", () => {
  it("creates a normal user", (done) => {
    chai
      .request(app)
      .post("/api/v1/users")
      .send(normalUser)
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
        email: normalUser.email,
        password: normalUser.password,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.userId).to.equals(normalUser.email);
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
