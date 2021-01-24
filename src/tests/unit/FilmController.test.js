const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);
const AWS = require('aws-sdk');
const FILMS_URL = '/api/films/';

// Mock AWS using jest
jest.mock('aws-sdk');


test('GET /api/films should bring all movies. OK(200)', async () =>{
    AWS.DynamoDB.DocumentClient.mockImplementation(() => {
        return {
            scan: (params, cb) => cb(null,
                { Items: [{ title: 'Conan the Barbarian', year: 1982 },
                          { title: 'Indiana Jones and the Last Crusade', year: 1989}
                         ]
                })
        };
    });

    const response = await request
        .get(FILMS_URL)
        .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body).toContainEqual({ title: 'Conan the Barbarian', year: 1982 })
    expect(response.body).toContainEqual({ title: 'Indiana Jones and the Last Crusade', year: 1989 })

});

test('POST /api/films should create new movie. CREATED(201)', async() => {

    const newFilm = { title:"The Goonies", year: 1985};

    AWS.DynamoDB.DocumentClient.mockImplementation(() => {
        return { put: (params, cb) => cb(null, newFilm)};
    });

    const response = await request
        .post(FILMS_URL)
        .send(newFilm)
        .expect(201);

    expect(response.body.id).toBe(0);
    expect(response.body.title).toBe('The Goonies');
    expect(response.body.year).toBe(1985);
})
