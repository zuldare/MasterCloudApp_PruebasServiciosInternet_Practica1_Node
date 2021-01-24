const app = require('../../app')
const supertest = require('supertest')
const request = supertest(app)
const { GenericContainer } = require("testcontainers");
const createTableIfNotExist = require("../../db/createTable")
const AWS = require('aws-sdk');
const FILMS_URL = '/api/films/';

let dynamoContainer;

// Before tests, dynamoTestContainrer must be set
beforeAll(async () => {

    // Set dynamo container data, like ports.
    dynamoContainer = await new GenericContainer("amazon/dynamodb-local","1.13.6")
        .withExposedPorts(8000)
        .start();

    // Configuration needed in order to configure AWS (local or remote)
    AWS.config.update({
        region: process.env.AWS_REGION || 'local',
        endpoint: process.env.AWS_DYNAMO_ENDPOINT || `http://localhost:${dynamoContainer.getMappedPort(8000)}`,
        accessKeyId: "xxxxxx",
        secretAccessKey: "xxxxxx"
    });

    // This is needed in order to create a schema if it not exists.
    await createTableIfNotExist("films");
});


// In order to stop container.
afterAll(async () => {
    await dynamoContainer.stop();
})

jest.setTimeout(20000);

test('GET /api/films should bring all movies. OK(200)', async () =>{
    const films = [
            { title: 'Conan the Barbarian', year: 1982 },
            { title: 'Indiana Jones and the Last Crusade', year: 1989}
        ];

    await request.post(FILMS_URL).send(films[0]);
    await request.post(FILMS_URL).send(films[1]);

    return await request
        .get(FILMS_URL)
        .expect(200)
        .then(response => {
            // This assertions must be done this way because dynamoDB returns elements unordered
            for(let i=0; i<films.length; i++) {
                let item = response.body.find(element => element.title === films[i].title );
                expect(item.title).toEqual(films[i].title);
                expect(item.year).toEqual(films[i].year);
            }
        });
});


test('POST /api/films should create new movie. CREATED(201)', async() => {

    const numberOfElements = await request
        .get(FILMS_URL)
        .then(response => response.body.length);

    const newFilm = { title:"The Goonies", year: 1985};

    return await request
        .post(FILMS_URL)
        .send(newFilm)
        .expect(201)
        .then(response => {
            expect(response.body.id).toBe(numberOfElements);
            expect(response.body.title).toBe(newFilm.title);
            expect(response.body.year).toBe(newFilm.year);
        });
});