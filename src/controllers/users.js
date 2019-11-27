import uuidv1 from "uuid/v1";
import dbActions from "../models/users";
import utils from "./utils";


exports.login = (request, response) => {
  // get email and paddword from body
  const { email, password } = request.body;
  // check if payload is present
  if (!email || !password || email === "" || password === "") {
    response.status(400).json({
      status: "error",
      data: "Email and password fields are required",
    });
  } else {
    const cleanEmail = email.trim();
    dbActions.findOne([cleanEmail])
      .then((user) => {
        console.log(user);
        if (!user) {
          response.status(400).json({
            status: "error",
            data: "user does not exist",
          });
        } else {
          //


          const { id, hashedpassword, isstaff } = user;
          const passwordIsValid = utils.comparePassword(password.trim(), hashedpassword);
          if (!passwordIsValid) {
            response.status(401).json({
              status: "error",
              data: "Incorrect password",
            });
          } else {
            const userObj = {
              cleanEmail,
              isstaff,
            };
            const token = utils.JWTToken(userObj);
            // respond with jwt token
            response.status(200).send({
              status: "success",
              data: {
                userId: id,
                email,
                token,
              },
            });
          }
        }
      })


      .catch(
        (err) => response.status(500).send({
          status: "error",
          data: err.stack,
        }),
      );
  }
};


// create user
exports.signUp = (request, response) => {
  const {
    firstName, lastName, gender, jobRole, department, address, email, password, isStaff,
  } = request.body;
  const validateEmail = utils.isValidEmail(email.trim());
  const requiredFields = (firstName && lastName && email && password
      && gender && jobRole && department && address
  );

  if (!requiredFields) {
    response.status(400).json({
      status: "error",
      data: "all fields are required",
    });
  } else if (!validateEmail) {
    response.status(400).json({
      status: "error",
      data: "Please provide a valid email",
    });
  } else {
    const id = uuidv1();
    const trimmedEmail = email.trim().toLowerCase();
    const hashedPassword = utils.hashPassword(password.trim());
    const values = [
      id, firstName.trim(), lastName.trim(), trimmedEmail, hashedPassword,
      gender.trim(), jobRole.trim().toUpperCase(), department.trim(), address.trim(), isStaff,
    ];
    dbActions.save(values)
      .then(() => {
        const userObj = {
          trimmedEmail,
          isStaff,
        };
        const token = utils.JWTToken(userObj);
        response.status(201).json({

          // respond with jwt token

          status: "success",
          data: {
            message: "User account successfully created",
            token,
            userId: id,
          },
        });
      })
      .catch((err) => {
        response.status(500).json({
          status: "error",
          data: err,
        });
      });
  }
};


// exports.viewAllUsers = (request, response) => {
//   pool.connect((err, client, done) => {
//     const query = "SELECT * FROM users";
//     client.query(query, (error, result) => {
//       done();
//       if (error) {
//         response.status(400).send({
//           status: "error",
//           error,
//         });
//       } else if (result.rows < "1") {
//         response.status(200).send({
//           status: "success",
//           data: [],
//         });
//       } else {
//         response.status(200).send({
//           status: "success",
//           data: result.rows,
//         });
//       }
//     });
//   });
// };

// exports.getUserById = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       response.status(400).send({
//         status: "error",
//         data: error.stack,
//       });
//     }
//     response.status(200).send({
//       status: "success",
//       data: results.rows[0],
//     });
//   });
// };

// exports.modifyUser = (request, response) => {
//   const id = parseInt(request.params.id);
//   const { firstName, lastName } = request.body;

//   pool.query(
//     "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3", [firstName, lastName, id],
//     (error) => {
//       if (error) {
//         response.status(400).send({
//           status: "error",
//           error: error.stack,
//         });
//       }
//       response.status(200).send({
//         status: "success",
//         data: `User modified with ID: ${id}`,
//       });
//     },
//   );
// };

// exports.deleteUser = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("DELETE FROM users WHERE id = $1", [id], (error) => {
//     if (error) {
//       response.status(400).send({
//         status: "error",
//         error,
//       });
//     }
//     response.status(200).send({
//       status: "success",
//       data: `User deleted with ID: ${id}`,
//     });
//   });
// };
