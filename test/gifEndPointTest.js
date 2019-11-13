import chai from "chai";
import chaiHttp from "chai-http";
import fs from "fs";
import app from "../src/app";


const { expect } = chai;
chai.use(chaiHttp);


const currentPath = process.cwd();

// get test user token
const params = {
  email: "test@test.com",
  password: "test",
};

chai.request(app)
  .post("/api/v1/auth/signin/")
  .send(params)

  .then((res) => {
    const data = JSON.parse(res.text);
    const { token, userId } = data.data;
    let gifId;
    describe("Gifs Endpoint ", () => {
      it("should create a new gif image",
        async () => {
          const response = await chai.request(app)
            .post("/api/v1/gifs")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Authorization", `Bearer ${token}`)
            .field("title", "title")
            .field("userId", userId)
            .field("createdOn", new Date().toString())
            .attach("image",
              fs.readFileSync(`${currentPath}/test/image.png`),
              "preview.png");
          expect(response.body).to.be.an("object");
          expect(response.body.status).to.equal("success");
          expect(response.body.data).to.have.property("imageUrl");
          expect(response.body.data.message).to.equal("Your image has been uploded successfully to cloudinary");
          gifId = response.body.data.gifId;
        });

      it("should returns all gifs",
        async () => {
          const response = await chai.request(app)
            .get("/api/v1/gifs")
            .send();
          expect(response).to.have.status(200);
          expect(response.body.status).to.equals("success");
          expect(response.body.data).to.be.an("array");
        });

      it("should return a gif by ID",

        async () => {
          const response = await chai.request(app)
            .get(`/api/v1/gifs/ ${gifId}`)
            .send();

          expect(response).to.have.status(200);
          expect(response.body.status).to.equals("success");
          expect(response.body.data).to.be.an("object");
          expect(response.body.data).to.have.property("id");
          expect(response.body.data).to.have.property("user_id");
          expect(response.body.data).to.have.property("title");
          expect(response.body.data).to.have.property("url");
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
  });
