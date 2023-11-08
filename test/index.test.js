const chai = require('chai');
const expect = chai.expect;
const mocha = require('mocha');
const request = require('supertest');
const app = require('../index.js');
console.log(request);

// Khởi tạo Mocha
// mocha.suite('Đăng nhập đăng ký', () => {

    // Kiểm tra đăng nhập thành công
    it('Nên đăng nhập thành công với tên người dùng và mật khẩu chính xác', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'truongthai1',
                password: '1234'
            });

        expect(response.statusCode).to.equal(200);
        // expect(response.body).to.have.property('access_token');
    });

    // Kiểm tra đăng nhập thất bại với tên người dùng không tồn tại
    it('Nên đăng nhập thất bại với tên người dùng không tồn tại', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'truongthai123',
                password: '1234'
            });

        expect(response.statusCode).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    // Kiểm tra đăng nhập thất bại với mật khẩu không chính xác
    it('Nên đăng nhập thất bại với mật khẩu không chính xác', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'truongthai1',
                password: 'password2'
            });

        expect(response.statusCode).to.equal(401);
        expect(response.body).to.have.property('message');
    });

    // Kiểm tra đăng ký thành công
    it('Nên đăng ký thành công với tên người dùng và mật khẩu hợp lệ', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'NguyenVanC',
                password: '1234'
            });

        expect(response.statusCode).to.equal(201);
        expect(response.body).to.have.property('message');
    });

    // Kiểm tra đăng ký thất bại với tên người dùng đã tồn tại
    it('Nên đăng ký thất bại với tên người dùng đã tồn tại', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'truongthai1',
                password: 'password2'
            });

        expect(response.statusCode).to.equal(400);
        expect(response.body).to.have.property('message');
    });
// });

// Chạy testcase
// mocha.run();