// import { error, success } from "../Utils/response_wrapper.js";
// import { client } from "../dbConnet.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

const { error, success } = require("../Utils/response_wrapper.js");
const { client } = require("../dbConnet.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupcontroller = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.send(error(400, "all fields are required"));
      return;
    }
    console.log(email);
    let response = await client.search({
      index: "my_index",
      body: {
        query: {
          term: {
            email: email,
          },
        },
      },
    });

    let existing_user = response.hits.hits.length;
    console.log(existing_user);
    console.log(response.hits);
    if (existing_user) {
      res.send(error(400, "user already exists"));
      return;
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const data = {
      email: email,
      password: hashed_password,
      firstName: firstName,
      lastName: lastName,
    };
    await client.index({
      index: "my_index",
      body: data,
    });
    res.send(success(200, "User added successfully in the database"));
  } catch (e) {
    res.send(error(400, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send(error(400, "Email or Password in missing"));
      return;
    }

    let response = await client.search({
      index: "my_index",
      body: {
        query: {
          term: {
            email: email,
          },
        },
      },
    });

    let existing_user = response.hits.hits.length;
    if (!existing_user) {
      res.send(error(400, "User doesn't exists"));
      return;
    }
    const user = response.hits.hits[0]._source;
    const id = response.hits.hits[0]._id;

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.send(error(400, "Incorrect Email or Password"));
      return;
    }
    const accessToken = generateAccessToken({ id });
    return res.send(success(200, { user, accessToken }));
  } catch (e) {
    res.send(error(400, e));
  }
};
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "20s",
    });
    return token;
  } catch (e) {
    console.log("Error in generating token :- ", e);
  }
};
module.exports = {
  signupcontroller,
  loginController,
};
