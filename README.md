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

### AWS configuration

#### DynamoDB

You must create a DynamoDB table with the following specifications:
* **Name:** It can be any name
* **Primary key name:** PK 
* **Sort key name:** SK

<img width="700" src="https://github.com/btgdevelopers/various/raw/master/57blocks-test/dynamo.png">

* You must create an item with the following information:
    * **PK:** PARAMS
    * **SK:** PARAMS
    * **jwtExpirationTime:** Login expiration time in [ms](https://www.npmjs.com/package/ms) format

<img width="900" src="https://github.com/btgdevelopers/various/raw/master/57blocks-test/dynamo2.png">

#### IAM

* You must create an IAM user with Access key - Programmatic access.

<img width="900" src="https://github.com/btgdevelopers/various/raw/master/57blocks-test/iam1.png">

* Select “Attach existing policies directly” and chose the “AmazonDynamoDBFullAccess” policy.

<img width="900" src="https://github.com/btgdevelopers/various/raw/master/57blocks-test/iam2.png">

* You don’t have to set any tags

* Once you create the user, you need to safely store the access key id and the secret access key

<img width="900" src="https://github.com/btgdevelopers/various/raw/master/57blocks-test/iam3.jpg">

### Environment variables

Once the configuration is complete, you must set a `.env` file with the following environment variables:\
**You must fill the information of your DynamoDB database and IAM user.**

```sh
PORT=3000
ROOT_PATH=/api
JWT_SECRET=<ANY_STRING>
LOGGER_LEVEL=debug
AWS_DEFAULT_REGION=<YOUR_AWS_DYNAMODB_REGION>
AWS_ACCESS_KEY=<YOUR_AWS_DYNAMODB_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_DYNAMODB_SECRET_ACCESS_KEY>
AWS_DYNAMO_TABLE_NAME=<YOUR_AWS_DYNAMODB_TABLE_NAME>
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

**API Documentation:** [Movie API documentation](https://documenter.getpostman.com/view/22689703/VUjMokfV)\
**Additional Documentation:** [Software documentation](https://drive.google.com/file/d/1RwjVA8p2OcW6j_bv7gc3a4C_fWZ6k_P1/view?usp=sharing)
