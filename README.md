# Mongoose Query Maker

Mongoose Query Maker is a powerful tool for MongoDB with Mongoose that simplifies and enhances database querying. It provides a wide range of features for filtering, pagination, field selection, and population, making it easier to work with your MongoDB data. It seamlessly integrates with Mongoose for a smooth development experience.

## Features

- **Filtering:** Easily create complex queries with built-in filtering options.
- **Pagination:** Implement pagination for large data sets with simple configuration.
- **Field Selection:** Choose which fields to include or exclude in query results.
- **Population:** Populate related data for a comprehensive view of your documents.

## Installation

You can install Mongoose Query Maker using npm:

```bash
npm install mongoose-query-maker
```

```bash
yarn add mongoose-query-maker
```

## Query Parameters

### 1) Filtering

In this package, we offer support for various filter operations to help you query your data effectively. The following filter operations are available:

- `$eq`: Equal
- `$ne`: Not Equal
- `$gt`: Greater Than
- `$gte`: Greater Than or Equal
- `$lt`: Less Than
- `$lte`: Less Than or Equal
- `$in`: In (Matches any value in an array)
- `$nin`: Not In (Does not match any value in an array)
- `$all`: All (Matches all values in an array)
- `$size`: Size (Matches arrays with a specific length)
- `$exists`: Exists (Checks if a field exists)
- `$type`: Type (Checks the data type)
- `$regex`: Regular Expression
- `$mod`: Modulus (Divides by a value and returns the remainder)

**Query Structure:**

To execute filter queries, use the `$and` condition, specifying each filter operation as follows:

[field_name]=[$operation_type]:[execution_value]

**Example API Requests:**

- Filter documents with a specific value:

  ```http
  GET /api/v1/services?category=$eq:646c817b303ae9cca93ad11b
  ```

  Query Output:

  ```json
  { "category": { "$eq": "646c817b303ae9cca93ad11b" } }
  ```

- Combine multiple filter operations to refine your query:

  ```http
  GET /api/v1/services?category=$eq:646c817b303ae9cca93ad11b&price=$gte:50&price=$lte:90
  ```

  Query Output:

  ```json
  {
    "$and": [
      { "category": { "$eq": "646c817b303ae9cca93ad11b" } },
      { "price": { "$gte": 50 } },
      { "price": { "$lte": 90 } }
    ]
  }
  ```

- Pass multiple values for perticular filter operations:

  For filter operations like `$in`, `$nin`, `$all`, and `$mod`, you can pass multiple values separated by commas. For an example, Filter services with multiple 'category' values using `$in`

  ```http
  GET /api/v1/services?category=$in:value1,value2,value3
  ```

  Query Output:

  ```json
  { "category": { "$in": ["value1", "value2", "value3"] } }
  ```

- Support for Any Regular Expression:

  For greater flexibility, our filtering feature supports any kind of regular expression using the `$regex` operation. You can apply a wide range of regular expressions to filter data, making it a versatile tool for your data querying needs.

  ```http
  GET /api/v1/services?description=$regex:pattern
  ```

  Query Output:

  ```json
  { "description": { "$regex": /pattern/<flags> } }
  ```

If no authorized query parameter is provided, the query output will be an empty object `{}`. Filter operations are authorized based on specific criteria, including accessibility for different user roles, which will be discussed later in this documentation.

### 2) Pagination

Easily implement pagination in your API requests with the following query parameters, each with default values:

- `page` (default: 1): Specify the page number.
- `limit` (default: 10): Define the number of items per page.
- `sort` (default: createdAt): Sort results by a specific field. You can use Mongoose-style sorting:

  - To sort in ascending order by a field, use the field name (e.g., `sort=createdAt`).
  - To sort in descending order by a field, prefix the field name with a hyphen (e.g., `sort=-createdAt`).
  - For multiple sorting criteria, separate them by a comma (e.g., `sort=createdAt,-age`).

**Example API Request:**

```http
GET /api/v1/services?page=1&limit=10&sort=createdAt
```

This request fetches the first page of services, with a limit of 10 items per page, sorted by the 'createdAt' field in ascending order.

Note: By adding default values, it clarifies how the pagination parameters behave if they are not explicitly provided in the API request.

### 3) Field Selection

You can customize the fields included in the API response using the `select` query parameter. This functionality is similar to Mongoose's `select` feature. By default, the API will return the full document when the `select` parameter is not passed.

**Example API Requests:**

- Include only the 'title' field in the response:

  ```http
  GET /api/v1/services?select=title
  ```

- Include multiple fields and exclude the '\_id' field:

  ```http
  GET /api/v1/services?select=title,name.firstName,email,author,-_id
  ```

In the second request, fields to include are separated by commas, and fields to exclude are prefixed with a hyphen (-). Specify the fields you need to tailor your API response to your exact requirements.

### 4) Population

To retrieve related data, you can use the `populate` query parameter in your API requests. This feature allows you to fetch data from referenced collections.

**Basic Population:**

- To populate the 'category' data, use the following query:

  ```http
  GET /api/v1/services?populate=category
  ```

**Multiple Populations:**

- You can pass multiple populate requests in the same query parameter to retrieve information from multiple sources:

  ```http
  GET /api/v1/services?populate=category&populate=tags
  ```

**Field Selection with Population:**

- Similar to the 'Field Selection' feature (see section 3), you can select specific fields for population by using the populate query parameter with field names separated by a colon:

  ```http
  GET /api/v1/services?populate=category:title,-_id
  ```

  ```http
  GET /api/v1/services?populate=category:title,-_id&populate=tags:title
  ```

**Nested Object / Array of Object Populations:**

- For nested documents/objects, specify the query like this:

  ```http
  GET /api/v1/services?populate=meta.user:name
  ```

**Nested Populations:**

- When you need to populate data from nested populations, it's essential to include the parent population in your query. Without the parent population, nested populations won't function as expected.

  For example, to retrieve data from both 'category' and 'category.author' nested populations, use queries like this:

  ```http
  GET /api/v1/services?populate=category:title&populate=category.author:name
  ```

Note: It's optional to select specific fields during population. If no fields are provided after the colon, the entire document will be returned.

## Core Elements

- **Functions**

  - `queryMaker`: The queryMaker function is a versatile tool designed to handle filtering, pagination, field selection, and population in MongoDB queries.
  - `querySelector`: The querySelector function is specialized in handling field selection and population in MongoDB queries.

- **TypeScript Types**

  - `AuthRules`: It's a generic type designed to enhance the security of filtering based on user roles. The first parameter is the mongoose schema interface, and the second parameter is the user role. This type assists in defining and enforcing filtering rules securely within your application.

### `queryMaker()`

**Description:** The `queryMaker` function is a powerful tool for building and executing complex MongoDB queries. It allows you to filter, select, populate, and paginate data based on specified criteria. With the ability to handle various filter operations, field selection, population, and pagination, this function provides extensive control over your data queries.

- #### **Step 1: Extract User Information From Token**

  The `queryMaker` function does not process JWT tokens directly. Instead, you are responsible for extracting user information, such as the user's `_id` and `role` from the token outside the function's scope. When passing user information as arguments to the `queryMaker` function, ensure that the token includes the user's `_id` and `role` if the user is authenticated. In cases where the user is not authenticated, the token can be set to `null`.

  ```typescript
  // Example user object, or pass 'null'
  { _id: "", role: "", ...} || null
  ```

- #### **Step 2: Defining AuthRules**

  ```typescript
  // Example 01
  const serviceAuthRules: AuthRules<IService, IRole> = {
    authentication: 'OPEN',
    query: [
      ['category', ['$eq', '$ne']],
      ['mentor', ['$eq']],
      ['status', ['$eq']],
      ['packages.price', ['$gt', '$gte', '$lt', '$lte']],
      ['title', ['$regex']]
    ],
    select: ['password'],
    populate: [
      ['mentor', ['password']],
      ['category', []],
      ['topics', []],
      ['topics.category', []]
    ]
  }

  // Example 02
  const serviceAuthRules: AuthRules<IService, IRole> = {
    authentication: [
      [['admin', 'super_admin'], 'OPEN'],
      [['seller'], ['sellerId']],
      [['mentor'], ['mentorId', 'userId']]
    ],
    query: [
      ['category', ['$eq', '$ne']],
      ['mentor', ['$eq']],
      ['status', ['$eq']],
      ['packages.price', ['$gt', '$gte', '$lt', '$lte']],
      ['title', ['$regex']]
    ],
    select: ['password', 'contact'],
    populate: [
      ['mentor', ['password']],
      ['category', []],
      ['topics', []],
      ['topics.category', []]
    ]
  }
  ```

  - `authentication`: This authentication field defines the authentication process for querying or filtering data, establishing rules for document access. It encompasses open-to-all, user-role-based, and user-based scenarios. The following rules delineate the authentication process:

    - **Open Access for All**: When set to the string `'OPEN'`, it indicates that the fields are open to everyone. Query execution does not involve role-based or user-based checking, allowing unrestricted access to the entire database collection. For example, if filtering the collection by the category according to above "Example 01", the query would look like this:

      ```json
      { "category": { "$eq": "646c817b303ae9cca93ad11b" } }
      ```

    - **User-Role-Based Authentication**: Role-based authentication allows you to specify user roles that have access to query or filter the data. Use `[ [['role1', ...], 'OPEN'], ...]` to check whether the user has a valid token. If a valid token is present, the collection is open for querying or filtering; otherwise, it'll throw an unauthorized error. For example, with the following configuration on "Example 02" `[[['admin', 'super_admin'], 'OPEN'], ...]`, where "admin" and "super_admin" have role-based access. If filtering the collection by the category as an "admin" or "super_admin" would result in the query:

      ```json
      { "category": { "$eq": "646c817b303ae9cca93ad11b" } }
      ```

    - **User-Based Authentication**: User-based authentication allows you to verify whether the user owns or has permission to access a document. The document should include the user `_id` in any of the specified fields. To implement this, use the following format: `[ [['role1', ...], ['field1', ...]], ...]` to check for the user \_id in any of these fields. It employs a $or operation for multiple fields and adds the user \_id without $or for a single field. For example, with the following configuration on "Example 02" `[[['seller'], ['sellerId']], ...]`, if filtering the collection by the category as a "seller" would result in the query:

      ```json
      {
        "$and": [
          { "category": { "$eq": "646c817b303ae9cca93ad11b" } },
          { "sellerId": { "$eq": "sellerUserIdFromToken" } }
        ]
      }
      ```

      Similarly, if present in multiple fields, with the configuration on "Example 02" `[[['mentor'], ['mentorId', 'userId']], ...]`, if filtering the collection by the category as a "mentor" would result in the query:

      ```json
      {
        "$and": [
          { "category": { "$eq": "646c817b303ae9cca93ad11b" } },
          {
            "$or": [
              { "mentorId": { "$eq": "mentorUserIdFromToken" } },
              { "userId": { "$eq": "mentorUserIdFromToken" } }
            ]
          }
        ]
      }
      ```

  - `query`: The query field is a set of rules that define secure filtering behavior when using query parameters in your API requests. It is structured as an array of tuples, each containing two elements. These tuples specify the filtering behavior for specific fields, ensuring secure and controlled filtering in your MongoDB queries.

    - **Field Name (String):** The first element is a string representing the key of the schema interface for a specific field in your Mongoose model. This field is allowed to be used as a query parameter in API requests for filtering.

    - **Allowed Operations (Array of Strings):** The second element is an array of strings specifying the allowed query operations for filtering. If a request uses an operation not listed in this array, an error will be thrown. Operation can be, `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$all`, `$size`, `$exists`, `$type`, `$regex`, `$mod` which we already discussed earlier.

    These are the some setuations and how it will work or response.

    - With the following configuration on "Example 01"

      ```json
      [
        ["category", ["$eq", "$ne"]],
        ["mentor", ["$eq"]],
        ["status", ["$eq"]],
        ["packages.price", ["$gt", "$gte", "$lt", "$lte"]],
        ["title", ["$regex"]]
      ]
      ```

      - When the query is requested with `?category=$eq:646c817b303ae9cca93ad11b`, the operation type '$eq' is authenticated specifically for the 'category' field. It'll execute.
      - When the query is requested with `?category=$in:646c817b303ae9cca93ad11b`, the operation type '$in' is not authenticated specifically for the 'category' field. It'll throw an error.
      - When the query is requested with `?packages.price=$gte:20`, the operation type '$gte' is authenticated specifically for the 'packages.price' field. It'll execute.
      - When the query is requested with `?packages.price=$eq:20`, the operation type '$eq' is not authenticated specifically for the 'packages.price' field. It'll throw an error.

    **Note**: If the requested person is authorized then it will proceed to the next. Otherwise an authorization error is issued as the initial response.

  - `select`: The select field is an array of string. These are specific fields which fields are not allowed to be queried using `select` query parameter. It is used to restrict the selection of specific document attributes in the query results. These are the some setuations and how it will work or response.

    - With the following configuration on "Example 01" `['password']`, let assume `contact` field have two nested fields called `email`, and `number`. It can be object or array of object.

      - If requested query is `?select=title,packages,password` then response will be `title packages`.
      - If requested query is `?select=title,packages,password,-_id` then response will be `title packages -_id`.
      - If requested query is `?select=-title` then response will be `-title -password`.
      - If requested query is `?select=-title,-_id` then response will be `-title -_id -password`.
      - If requested query is `?select=-title,-_id,-packages` then response will be `-title -_id -packages -password`.
      - If requested query is `?select=title,contact` then response will be `title contact`.
      - If requested query is `?select=title,contact.email` then response will be `title contact.email`.
      - If requested query is `?select=-title,-contact.email` then response will be `-contact.email -password`.

    - With the following configuration on "Example 02" `['password', 'contact']`,

      - If requested query is `?select=title,packages,password` then response will be `title packages`.
      - If requested query is `?select=title,packages,password,-_id` then response will be `title packages -_id`.
      - If requested query is `?select=-title` then response will be `-title -password -contact`.
      - If requested query is `?select=-title,-_id` then response will be `-title -_id -password -contact`.
      - If requested query is `?select=-title,-_id,-packages` then response will be `-title -_id -packages -password -contact`.
      - If requested query is `?select=title,contact` then response will be `title`.
      - If requested query is `?select=title,contact.email` then response will be `title`.
      - If requested query is `?select=-title,-contact.email` then response will be `-title -password -contact`.

    **Note:** When utilizing both the `include` and `exclude` fields together, Mongoose may throw an error. For a detailed understanding of how Mongoose handles this scenario, please refer to the official Mongoose documentation on [Query.prototype.select()](<https://mongoosejs.com/docs/api/query.html#Query.prototype.select()>).

  - `populate`: The populate field is an array of tuples. The first parameter of each tuple indicates the field that can be populated using the `populate` query parameters. The second parameter is an array of fields that should not be shared with the front end when populating. Which is exact similar to `select`. For example, you can specify that the "mentor" field can be populated, but you do not want to share the "password" attribute when populating the "mentor" field. With the "populate" feature, you can:

    - Basic population
    - Multiple population
    - Population with field selection
    - Nested object / array of object population
    - Nested population

    Suppose, With the following configuration on "Example 01"

    ```json
    [
      ["mentor", ["password"]],
      ["category", []],
      ["topics", []],
      ["topics.category", []]
    ]
    ```

    - If requested query is `?populate=mentor&populate=category:title&populate=user&populate=topics&populate=topics.category` then response will be

      ```json
      [
        {
          "path": "mentor",
          "select": "-password",
          "populate": []
        },
        {
          "path": "category",
          "select": "title",
          "populate": []
        },
        {
          "path": "topics",
          "select": "title",
          "populate": [
            {
              "path": "category",
              "select": "",
              "populate": []
            }
          ]
        }
      ]
      ```

      **Note:** The requested population operation with `&populate=user` has been removed due to it being an unauthorized populate operation.

    - If requested query is `?populate=topics&populate=topics.category` then response will be

      ```json
      [
        {
          "path": "topics",
          "select": "title",
          "populate": [
            {
              "path": "category",
              "select": "",
              "populate": []
            }
          ]
        }
      ]
      ```

    - If requested query is `?populate=topics.category` then response will be

      ```json
      []
      ```

      **Note:** It will not work as expected. Because, When you need to populate data from nested populations, it's essential to include the parent population in your query. Without the parent population, nested populations won't function as expected.

    **Note:** For a detailed understanding of how Mongoose handles this nested populating scenario, please refer to the official Mongoose documentation on [Populating across multiple levels](https://mongoosejs.com/docs/populate.html#deep-populate).

  **Important Note: TypeScript Key Suggestions**

  Please note that the Mongoose Query Maker currently does not provide TypeScript key suggestions for the "populate" field. However, it does support the specified structure for building these fields.

  While TypeScript key suggestions can be a helpful feature, the Mongoose Query Maker relies on the defined structure to determine how to handle "populate" field. Therefore, it's important to ensure that the structure of these fields adheres to the guidelines provided in the documentation to achieve the desired results.

```typescript
const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  const queryResult = queryMaker(req.query, req.user, serviceAuthRules)

  const { query, pagination, select, populate } = queryResult
  const { page, limit, skip, sort } = pagination

  const result = await Service.find(query, select, { limit, skip, sort, populate })

  res.send(result)
}
```

### `querySelector()`

**Description:** The `querySelector` function is a powerful tool. It allows you to select, and populate data based on specified criteria. This function exact do the same what `queryMaker` does. The key difference is less features.

- `queryMaker`: filter, select, populate, and paginate
- `querySelector`: select, and populate

**Note:** It only handle select, populate for you. It doesn't provied any authentication checking. You have to make sure it manually.

```typescript
const getSingleService = async (req: Request, res: Response, next: NextFunction) => {
  const queryResult = querySelector(req.query, serviceAuthRules)
  const { select, populate } = queryResult

  const result = await Service.findById(req.params.id, select, { populate })

  res.send(result)
}
```

## Contributing

We welcome contributions from the community. If you want to contribute to this project.

## License

This project is licensed under the MIT License.

## Contact

For questions, feedback, or support, please feel free to contact at [personal.sifat@gmail.com](mailto:personal.sifat@gmail.com).

#### Thank you for using Mongoose Query Maker!
