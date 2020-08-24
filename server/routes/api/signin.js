const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

//Sign-up
router.post("/account/signup", (req, res, next) => {
  const { body } = req;
  console.log("body", body);

  const { userName, password } = body;
  let { email } = body;

  if (!userName) {
    return res.send({
      success: false,
      message: "Error: Username cannot be blank.",
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank.",
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank.",
    });
  }

  email = email.toLowerCase();

  User.find(
    {
      email: email,
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      }

      //Save new user
      const newUser = new User();
      newUser.email = email;
      newUser.userName = userName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error",
          });
        }
        return res.send({
          success: true,
          message: "Signed up",
        });
      });
    }
  );
});

//Sign-in
router.post("/account/signin", (req, res, next) => {
  const { body } = req;
  const { userName, password } = body;
  let { email } = body;
  email = email.toLowerCase();

  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email cannot be blank.",
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password cannot be blank.",
    });
  }

  User.find(
    {
      email: email,
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      }
      if (users.length != 1) {
        return res.send({
          sucess: false,
          message: "Error: Invalid",
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          sucess: false,
          message: "Error: Invalid",
        });
      }

      const newUserSession = new UserSession();
      newUserSession.userId = user._id;
      newUserSession.save((err, doc) => {
        if (err) {
          return res.send({
            sucess: false,
            message: "Error: Invalid",
          });
        }

        return res.send({
          success: true,
          message: "Valid sign in",
          token: doc._id,
        });
      });
    }
  );
});

//Verify
router.get("/account/verify", (req, res, next) => {
  const { query } = req;
  const { token } = query;

  UserSession.find(
    {
      _id: token,
      isDeleted: false,
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Invalid",
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid",
        });
      } else {
        return res.send({
          success: true,
          message: "good",
        });
      }
    }
  );
});

//Logout
router.get("/account/logout", (req, res, next) => {
  const { query } = req;
  const { token } = query;

  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    null,
    (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      }

      return res.send({
        success: true,
        message: "good",
      });
    }
  );
});

module.exports = router;
