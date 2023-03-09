import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//REGISTER USER API

export const register = async (req, res) => {
  try {
    const {
      firstName,
      //   lastName,
      //   email,
      password,
      //   picturePath,
      //   friends,
      //   location,
      //   occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const HashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      //   lastName,
      //   email,
      password: HashedPassword,
      //   picturePath,
      //   friends,
      //   location,
      //   occupation,
      impressions: Math.floor(Math.random * 1000),
      viewedProfile: Math.floor(Math.random * 1000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
