# Word Nerd Server

An App to help teachers in the classroom!
Make a list of vocabulary words and play a pass-the-ball game to review and practice fluency.

## Technology

Javascript, Node, Express, Knex, PostgreSQL

## Client Repo [Here](https://github.com/josno/word-nerd-client)

## How To Use By Endpoints

```
/api/v1/users
```

### Method: POST '/'

-   Request Body
    -   full_name
    -   user_name
    -   password
-   Response Status
    -   201 Created
-   Error Status
    -   400 Bad Request

## How To Use By Endpoints

```
/api/v1/auth/
```

### Method: POST '/'

-   Request Body
    -   user_name
    -   password
-   Response Status
    -   201 Created
-   Error Status
    -   400 Bad Request

```
/api/v1/games
```

### Method: POST '/'

-   Request Body
    -   title
    -   word_list
    -   date_created
-   Response Status
    -   201 Created
-   Error Status
    -   400 Bad Request

```
/api/v1/games
```

### Method: GET '/'

-   Request Body
    -   none required
-   Response Status
    -   200 Created
-   Error Status
    -   400 Bad Request
