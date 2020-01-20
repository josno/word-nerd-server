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
-   Sucessful Response Status
    -   201 Created

## How To Use By Endpoints

```
/api/v1/auth/
```

### Method: POST '/'

-   Request Body
    -   user_name
    -   password
-   Sucessful Response Status
    -   201 Created

```
/api/v1/games
```

### Method: POST '/login'

-   Request Body
    -   user_name
    -   password
-   Sucessful Response Status
    -   201 Created

```
/api/v1/games
```

### Method: GET '/'

-   Request Body
    -   none required
-   Sucessful Response Status
    -   200

### Method: POST '/'

-   Request Body
    -   title
    -   word_list
-   Sucessful Response Status
    -   201 Created

```
/api/v1/games
```

### Method: GET '/:game_id'

-   Request Body
    -   game_id (in request params)
-   Sucessful Response Status
    -   200 OK

### Method: DELETE '/:game_id'

-   Request Body
    -   game_id (in request params)
-   Sucessful Response Status
    -   204 No Content

### Method: PATCH '/:game_id'

-   Request Body

    -   title
    -   word_list
    -   game_id (in request params)
    -   user_id (in req.user set by auth)

-   Sucessful Response Status
    -   204 No Content
