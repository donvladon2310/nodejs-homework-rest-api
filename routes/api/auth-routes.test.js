const mongoose = require("mongoose");
const requvest = require("supertest");

const app = require("../../app");

const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const { DB_HOST_TEST, PORT } = process.env;

describe("test /api/auth/login route", () => {
    let server = null;
    beforeAll(async () => {
        server = app.listen(PORT);
        await mongoose.connect(DB_HOST_TEST)
    })

    afterAll(async () => {
        server.close();
        await mongoose.connection.close(DB_HOST_TEST)
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    test("test login route with correct data", async () => {
        const userData = {
            email: "vlad@gmail.com",
            password: "123456"
        };

        const user = new User(userData);
        await user.save();

        const loginData = {
            email: "vlad@gmail.com",
            password: "123456"
        };

        const res = await requvest(app).post("/api/auth/login").send(loginData);
        expect(res.statusCode).toBe(200);

        const token = res.body.token;
        expect(token).toBeTruthy();

        const returnedUser = res.body.user;
        expect(returnedUser.email).toBe(userData.email);
        expect(returnedUser.subscription).toBe(userData.subscription);

    });
});
