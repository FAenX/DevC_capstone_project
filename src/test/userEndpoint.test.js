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
  it("creates a normal user if request sent by staff",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/users")
        .set("Authorization", "Staff true")
        .send(normalUser);

      expect(response).to.have.status(202);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("username");
      expect(response.body.data).to.have.property("email");
      expect(response.body.data).to.have.property("password");
      expect(response.body.data).to.have.property("first_name");
      expect(response.body.data).to.have.property("last_name");
      expect(response.body.data).to.have.property("is_staff");
      createdUserId = response.body.data.id;
    });

  it("refuses to create user if request sent by non staff",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/users")
        .set("Authorization", "Staff false")
        .send(normalUser);

      expect(response).to.have.status(401);
      expect(response.body.status).to.equals("error");
      expect(response.body.error).to.equals("access denied");
    });


  it("gets a user token",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/users/token")
        .send({
          email: normalUser.email,
          password: normalUser.password,
        });

      expect(response).to.have.status(200);
      expect(response.body.data.userId).to.equals(normalUser.email);
      expect(response.body.data.token).is.a("string");
      token = response.body.data.token;
    });


  it("retrieves all users",
    async () => {
      const response = await chai.request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });

  it("retrieves a single users",
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/users/${createdUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.data[0].id).to.equals(createdUserId);
      expect(response.body.data[0]).to.have.property("id");
      expect(response.body.data[0]).to.have.property("username");
      expect(response.body.data[0]).to.have.property("email");
      expect(response.body.data[0]).to.have.property("password");
      expect(response.body.data[0]).to.have.property("first_name");
      expect(response.body.data[0]).to.have.property("last_name");
      expect(response.body.data[0]).to.have.property("is_staff");
    });

  it("modifies a user",
    async () => {
      const response = await chai.request(app)
        .patch(`/api/v1/users/${createdUserId}/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          username: "another452_name",
          email: "another123_email",
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });


  it("deletes a user",
    async () => {
      const response = await chai.request(app)
        .delete(`/api/v1/users/${createdUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(204);
      // expect(response.body.status).to.equals("success");
    });
});
