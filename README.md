# react-express-recipe-finder

### /client

- the client was created using `create-react-app` installed globally via npm react -g, to provide a boostrapped project layout
- `*pre-requisites*`
  - create a `.env` file within this directory specifying the following:
  ``` bash
  REACT_APP_APIKEY=<APIKEY>
  // same key value as RECIPE_API_KEY
  ```

### /server

- `*pre-requisites*`
  - create a `.env` file within this directory specifying the following:
  ``` bash
  RECIPE_API_KEY=<APIKEY>
  JWT_SECRET=<JWTSECRET>
  ```