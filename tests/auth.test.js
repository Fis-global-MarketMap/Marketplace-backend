const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

// check mongodb connection
beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe("User Model Test", () => {
  const user = {
    name: "test",
    email: "test@test.com",
    test_password: "test123",
    phone: "123456789",
    lastn: "test",
    Datebirth: "12/12/1999",
    gender: "test",
    role: "admin",
    image: "1670175587536.jpg",
    job: "test",
    department: "R&D",
    leaves: [],
  };

  it("should create a new user with hashed password", async () => {
    const hashedPassword = await bcrypt.hash(user.test_password, 10);
    user.password = hashedPassword;
    const newUser = new User(user);
    const savedUser = await newUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(user.name);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.password).not.toBe(user.test_password);
    expect(savedUser.phone).toBe(user.phone);
    expect(savedUser.lastn).toBe(user.lastn);
    expect(savedUser.Datebirth).toBe(user.Datebirth);
    expect(savedUser.role).toBe(user.role);
    expect(savedUser.image).toBe(user.image);
    expect(savedUser.job).toBe(user.job);
    expect(savedUser.department).toBe(user.department);
    // LEAVES LENGTH IS 0
    expect(savedUser.leaves.length).toBe(0);
    expect(savedUser.gender).toBe(user.gender);
  });

  it("Login via password & check hashing", async () => {
    const logingUser = await User.findOne({ email: user.email });
    const isMatch = await bcrypt.compare(
      user.test_password,
      logingUser.password
    );
    expect(isMatch).toBe(true);
  });
});

// clear database after each test

