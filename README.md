# Movie API - 57blocks - Back-End Test

This API allows users to:
* Create a new element that can only be retrieved by themselves (Private item), or that can be retrieved by others (Public item)
* Read all public movies (Cursor-Based pagination supported)
* Read all elements created by themselves (Cursor-Based pagination supported)
* Edit the information of their movies created by themselves

## Installation

You must have [Node JS](https://nodejs.org/en/download/) and the [npm](https://nodejs.org/en/download/) package manager installed.\
Run the following command to install the necessary libraries.


```bash
npm install
```

## Usage

### Environment variables

Once the installation is complete, you must set a `.env` file with the following environment variables:\
**You must fill the information of your DynamoDB database.**

```sh
PORT=3000
ROOT_PATH=/api
JWT_SECRET=<ANY_STRING>
LOGGER_LEVEL=debug
AWS_DEFAULT_REGION=<YOUR_AWS_DYNAMODB_REGION>
AWS_ACCESS_KEY=<YOUR_AWS_DYNAMODB_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_DYNAMODB_SECRET_ACCESS_KEY>
AWS_DYNAMO_TABLE_NAME=Movies
PAGINATION_SECRET=<ANY_STRING>
RANDOM_API=https://csrng.net/csrng/csrng.php
```

### Test the project

This is the command to run the unit tests:

```bash
npm test
```

### Starting the project

This is the command to run the project: 

```bash
npm run dev
```

This is the successful result: 

```bash
[2022-08-07T18:10:45.344] [INFO] default - AWS DynamoDB database started
[2022-08-07T18:10:45.361] [INFO] default - HTTP Server listening in port 3000
```

### Documentation

**API Documentation:** [Movie API documentation](https://documenter.getpostman.com/view/22689703/VUjMokfV)

