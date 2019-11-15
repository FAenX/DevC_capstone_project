import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

import utils from "../utils/testUtils";


const { expect } = chai;
chai.use(chaiHttp);

const normalUser = {
  firstName: "firstName",
  lastName: "lastName",
  gender: "gender",
  email: utils.makeEmail(),
  password: "password",
  isStaff: false,
  department: "finance",
  jobRole: "assistant manager",
  address: "abc",
};

const params = {
  email: "test@test.com",
  password: "test",
};

let createdUserId;
let token;

describe("Users end point", () => {
  it("Should get a user token",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
          email: params.email,
          password: params.password,
        });

      expect(response).to.have.status(200);
      expect(response.body.data).to.have.property("userId");
      expect(response.body.data.token).is.a("string");
      token = response.body.data.token;
    });

  it("Should create a normal user",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/auth/create-user")
        .set("Authorization", `Bearer ${token}`)
        .send(normalUser);
      expect(response).to.have.status(202);
      expect(response.body.status).to.equals("success");
      expect(response.body.data.message).to.equals("User account successfully created");
      expect(response.body.data).to.have.property("token");
      createdUserId = response.body.data.userId;
    });

    it("Should fetch all users",
    async () => {
      const response = await chai.request(app)
        .get("/api/v1/auth")
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.be.an("array");
    });

});

describe("Users end point", () => {

  it("Should get a test normal user token",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/auth/signin")
        .send({
          email: normalUser.email,
          password: normalUser.password,
        });

      expect(response).to.have.status(200);
      expect(response.body.data).to.have.property("userId");
      expect(response.body.data.token).is.a("string");
      token = response.body.data.token;
    });
  
  it("refuses to create user if request sent by non staff",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/auth/create-user")
        .set("Authorization", `Bearer ${token}`)
        .send(normalUser);

      expect(response).to.have.status(401);
      expect(response.body.status).to.equals("error");
      expect(response.body.data.message).to.equals("Access denied, you should be admin to create user");
    });

  
  it("retrieves a single users",
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/auth/${createdUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.data.id).to.equals(createdUserId);
      expect(response.body.data).to.have.property("id");
      expect(response.body.data).to.have.property("email");
      expect(response.body.data).to.have.property("password");
      expect(response.body.data).to.have.property("first_name");
      expect(response.body.data).to.have.property("last_name");
      expect(response.body.data).to.have.property("is_staff");
    });

  it("modifies a user",
    async () => {
      const response = await chai.request(app)
        .patch(`/api/v1/auth/${createdUserId}/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          firstName: "another452_name",
          lastName: "another123_email",
        });

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });


  it("deletes a user",
    async () => {
      const response = await chai.request(app)
        .delete(`/api/v1/auth/${createdUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body.status).to.equals("success");
    });
});
