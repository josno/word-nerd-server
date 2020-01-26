![Home Page](/assets/word-nerd-img.png)

# Word Nerd Server

#### It's RESTful

<i class="devicon-react-original"></i>
The back end interface for the Word Nerd application. API for relevant and reusable user vocabulary lists, user authentication and new user validation.

## Demo The App [Here](https://word-nerd.now.sh/)

## Client Repo [Here](https://github.com/josno/word-nerd-client)

## Technology Used

-   Server Side Programming:

    -   Javascript
    -   Node
    -   Express
    -   Knex

*   Relational Databases:

    -   SQL
    -   PostgreSQL

## How To Use

```
git clone https://github.com/josno/word-nerd-server.git

cd word-nerd-server

npm i

npm start
```

## Endpoints Breakdown

#### Sign Up || Available Methods:

##### POST: Insert New User

```
/api/v1/users
```

#### Login || Available Methods:

##### POST: User Authentication With JWT

```
/api/v1/auth/
```

#### Games Router || Available Methods:

##### GET, POST

```
/api/v1/games
```

#### Games ID Router || Available Methods:

##### GET, PATCH, DELETE

```
/api/v1/games/:gameId
```
