# Start
- In shell:
    ```shell script
    npm start
    ```
# Create film (bash)

```
curl -d '{ "title": "Watchmen", "year" : 2009, "director": "Zack Snyder"}'\
    -H "Content-Type: application/json" -X POST http://localhost:3000/api/films/
```

# Run DynamoDB locally

```
    docker run --rm -p 8000:8000 -d amazon/dynamodb-local:1.13.6
```
 
# Run tests

### Run all tests
- In shell:
    ```shell script
    npm tests
    ```
### Run integration test 
- In shell:
    ```shell script
    npm run e2e:tests
    ```

### Run unit test
- In shell:
    ```shell script
    npm run unit:tests
    ```

# Author

👤 **Jaime Hernández Ortiz**

* Github: [@zuldare](https://github.com/zuldare)

Note that you should have to install Node.js, npm and Docker in order to run it.
