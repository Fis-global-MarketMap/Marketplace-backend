const mongoose = require("mongoose");
const User = require("models/User");
const Profile = require("models/Profile");

require("dotenv").config();

// check mongodb connection

beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI;
  await mongoose.connect(url, { useNewUrlParser: true });
});

describe("Profile Model Test", () => {
  const profile = {
    linkedin: "test linkedin",
    github: "test github",
    user: "",
    // skills array of strings
    skills: [
      {
        label: "c++",
        name: "c++",
      },
      {
        label: "javascript",
        name: "javascript",
      },
    ],
    timeline: [
      {
        title: "test1",
        description: "test description 1",
        from: new Date("12/12/1999"),
        to: new Date("12/12/2001"),
      },
      {
        title: "test2",
        description: "test description 2",
        from: new Date("12/12/2001"),
        to: new Date("12/12/2003"),
      },
    ],
  };

  it("Create a profile and affect it to a registred user", async () => {
    // find the last added user
    const lastUser = await User.findOne().sort({ _id: -1 });
    profile.user = lastUser._id;
    const newProfile = new Profile(profile);
    const savedProfile = await newProfile.save();
    expect(savedProfile._id).toBeDefined();
    expect(savedProfile.linkedin).toBe(profile.linkedin);
    expect(savedProfile.github).toBe(profile.github);
    expect(savedProfile.user).toBe(profile.user);
    expect(savedProfile.skills.length).toBe(2);
    expect(savedProfile.skills[0].label).toBe(profile.skills[0].label);
    expect(savedProfile.skills[0].name).toBe(profile.skills[0].name);
    expect(savedProfile.skills[1].label).toBe(profile.skills[1].label);
    expect(savedProfile.skills[1].name).toBe(profile.skills[1].name);
    expect(savedProfile.timeline.length).toBe(2);
    expect(savedProfile.timeline[0].title).toBe(profile.timeline[0].title);
    expect(savedProfile.timeline[0].description).toBe(
      profile.timeline[0].description
    );
    expect(savedProfile.timeline[0].from).toBe(profile.timeline[0].from);
    expect(savedProfile.timeline[0].to).toBe(profile.timeline[0].to);
    expect(savedProfile.timeline[1].title).toBe(profile.timeline[1].title);
    expect(savedProfile.timeline[1].description).toBe(
      profile.timeline[1].description
    );
    expect(savedProfile.timeline[1].from).toBe(profile.timeline[1].from);
    expect(savedProfile.timeline[1].to).toBe(profile.timeline[1].to);
  });
});

// clear database after each test
afterEach(async () => {
  await Profile.deleteMany();
  await User.deleteMany();
});
