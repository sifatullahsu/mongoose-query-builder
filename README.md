# Mongoose Query Maker

Mongoose Query Maker is a powerful tool for MongoDB with Mongoose that simplifies and enhances database querying. It provides a wide range of features for filtering, pagination, field selection, and population, making it easier to work with your MongoDB data.

## Features

- **Filtering:** Easily create complex queries with built-in filtering options.
- **Pagination:** Implement pagination for large data sets with simple configuration.
- **Field Selection:** Choose which fields to include or exclude in query results.
- **Population:** Populate related data for a comprehensive view of your documents.
- **Mongoose Integration:** Seamlessly integrates with Mongoose for a smooth development experience.

## Installation

You can install Mongoose Query Maker using npm:

```bash
npm install mongoose-query-maker
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
  {
    "$and": [{ "category": { "$eq": "646c817b303ae9cca93ad11b" } }]
  }
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
  {
    "$and": [{ "category": { "$in": ["value1", "value2", "value3"] } }]
  }
  ```

- Support for Any Regular Expression:

  For greater flexibility, our filtering feature supports any kind of regular expression using the `$regex` operation. You can apply a wide range of regular expressions to filter data, making it a versatile tool for your data querying needs.

  ```http
  GET /api/v1/services?description=$regex:pattern
  ```

  Query Output:

  ```json
  {
    "$and": [{ "description": { "$regex": new RegExp("pattern", "flags") } }]
  }
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

**Nested Object Populations:**

- For nested documents/objects, specify the query like this:

  ```http
  GET /api/v1/services?populate=meta.user:name
  ```

**Nested Populations and Parent Populations:**

- When you need to populate data from nested populations, it's essential to include the parent population in your query. Without the parent population, nested populations won't function as expected.

  For example, to retrieve data from both 'category' and 'category.author' nested populations, use queries like this:

  ```http
  GET /api/v1/services?populate=category:title&populate=category.author:name
  ```

Note: It's optional to select specific fields during population. If no fields are provided after the colon, the entire document will be returned.

For more detailed documentation and examples, please visit our GitHub repository.

## `1) queryMaker()` Implementation

**Description:** The `queryMaker` function is a powerful tool for building and executing complex MongoDB queries. It allows you to filter, select, and populate data based on specified criteria. With the ability to handle various filter operations, field selection, and population, this function provides extensive control over your data queries.

- ### **Step 1: Defining Authorized Fields**

  ```typescript
  const serviceAuthorizedFields: IQueryMakerFields<iService, iRole> = {
    all: 'OPEN',
    filter: [
      ['category', ['$eq', '$in'], 'OPEN'],
      ['mentor', ['$eq'], 'OPEN'],
      ['status', ['$eq'], 'OPEN'],
      ['packages.price', ['$gt', '$gte', '$lt', '$lte'], 'OPEN'],
      ['title', ['$regex'], 'OPEN']
    ]
  }
  ```

  - `all`: This key specifies which fields are open for access and the associated authentication criteria. It can take one of the following values:

    - `'OPEN'`: When set to `'OPEN'`, it means the fields are open for everyone, and query execution does not involve any role-based checking. These fields can be accessed without any restrictions.

    - `Array of User Role` Strings: When provided as an array of user role strings, the `all` key ensures that role-based checking occurs for fields if the query result is an empty object (`{}`). It checks whether the user holds a valid role to access the fields. This setting allows for controlled access based on user roles, ensuring secure data filtering.

    - `['ANY']`: The use of `['ANY']` signifies that the fields are accessible exclusively for registered users. It restricts access to only those with valid user accounts, offering an added layer of control.

    This flexibility in the `all` key allows you to define the level of access control for fields based on your specific requirements, whether they are open to all or restricted to specific user roles.

  - `filter`: This key is an array of tuples, each containing three elements to define the filtering behavior for specific fields when using query parameters in your API requests:

    - **Field Name (String):** The first element is a string representing the key of the schema interface for a specific field in your Mongoose model. This field is allowed to be used as a query parameter in API requests for filtering.

    - **Allowed Operations (Array of Strings):** The second element is an array of strings specifying the allowed query operations for filtering. If a request uses an operation not listed in this array, an error will be thrown. Operation can be, `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$all`, `$size`, `$exists`, `$type`, `$regex`, `$mod` which we already discussed earlier.

    - **Authentication Rules (Array of Tuples) / string "OPEN":** The third element is an array of tuples / string "OPEN" that define the authentication rules for the query. It determines who has access to filter by the specified field based on the following cases:

      - **Case 01: Open for All (No Authentication Required):** Use `OPEN` to indicate that no authentication is required for this field.

      - **Case 02: Open for Any Authenticated/Registered User:** Use `[ ['ANY', 'OPEN'] ]` to check whether the user has a valid token. If a valid token is present, the field is open for filtering.

      - **Case 03 & 04: Role-Based Authentication:** Role-based authentication allows you to specify user roles that have access to filter the field:

        For Case 03, specify the roles (e.g., 'super_admin', 'admin') for which the field is open, or combine roles in a single tuple.

        For Case 04, specify the roles and the field name to be checked against the user's ID. If the user's role matches and the user's ID matches the specified field, the field is open for filtering.

      **Note:** Case 03 and Case 04 can be combined, enabling fine-grained control over field access based on roles and user IDs.

    **Example 01:**

    ```typescript
    const serviceAuthorizedFields: IQueryMakerFields<iService, iRole> = {
      all: ['admin'],
      filter: [
        [
          'category',
          ['$eq', '$in'],
          [
            ['admin', 'OPEN'],
            ['mentor', 'mentor_id']
          ]
        ]
      ]
    }
    ```

    **For 'admin':**

    - The 'category' field allows two filter operations: '$eq' and '$in'.

    - Authentication rules for 'category' specify the following:

      For 'admin' users, the field is open `['admin', 'OPEN']`, meaning any 'admin' user can use the '$eq' and '$in' operations to filter the 'category' field without any additional checks.

      ```json
      {
        "$and": [{ "category": { "$eq": "646c817b303ae9cca93ad11b" } }]
      }
      ```

    **For 'mentor':**

    - The 'category' field allows the same filter operations: '$eq' and '$in'.

    - Authentication rules for 'category' also specify the following:

      For 'mentor' users, access to the field is conditional `['mentor', 'mentor_id']` upon their 'mentor_id' matching the user's ID extracted from the token. In other words, 'mentor' users can utilize the '$eq' and '$in' operations to filter the 'category' field. However, the query includes an additional condition that checks whether the 'mentor_id' matches the user's ID, ensuring that the filtered results include only documents where their 'mentor_id' is associated with their specific user ID.

      ```json
      {
        "$and": [
          { "category": { "$eq": "646c817b303ae9cca93ad11b" } },
          { "mentor_id": { "$eq": "userIdFromToken" } }
        ]
      }
      ```

      This means that 'mentor' users can filter the 'category' field, and the query dynamically incorporates their user ID and the specified field ('mentor_id') to guarantee that the results are limited to documents where their 'mentor_id' matches their extracted user ID from the token. This additional condition adds a layer of data security and access control for 'mentor' users.

    **Example 02:**

    ```typescript
    const serviceAuthorizedFields: IQueryMakerFields<iService, iRole> = {
      all: 'OPEN',
      filter: [['category', ['$eq', '$in'], 'OPEN']]
    }
    ```

    In this example, the `serviceAuthorizedFields` configuration is defined with access control and filtering rules for the "category" field of a service.

    - The `all` property is set to `'OPEN'`, allowing access for unauthenticated users and those with roles specified in the configuration.

    - In the `filter` array, the third parameter of the tuple for the "category" field is also set to `'OPEN,'` indicating that anyone, whether authenticated or not, can access and filter data using the "category" field.

    This configuration ensures that the "category" field is accessible to both authenticated and unauthenticated users. Additionally, if no valid filtration criteria are provided in a request, the configuration checks if the field is publicly open according to the `'OPEN'` property or based on roles with permission.

    **Example 03:**

    ```typescript
    const serviceAuthorizedFields: IQueryMakerFields<iService, iRole> = {
      all: ['ANY'],
      filter: [['category', ['$eq', '$in'], [['ANY', 'OPEN']]]]
    }
    ```

    In this example, the `serviceAuthorizedFields` configuration defines explicit access control and filtering rules for the "category" field of a service.

    - The `all` property is set to `['ANY']`, indicating that requested users must be authenticated to access and filter data. Only authenticated users with valid tokens are allowed to use this field for filtering.

    - In the `filter` array, the third parameter of the tuple for the "category" field is specified as `['ANY', 'OPEN']`. This means that the filter is eligible only for authenticated users. Specifically, users who are authenticated with valid tokens, regardless of their role, can access and filter data using the "category" field.

    This configuration provides a fine-grained approach to access control, allowing specific access and filtering permissions for each field. It ensures that only authenticated users can utilize this filter and access data securely.

- ### **Step 2: Extract User Information From Token**

  The `queryMaker` function does not process JWT tokens directly. Instead, you are responsible for extracting user information, such as the user's `_id` and `role`, from the token outside the function's scope. When passing user information as arguments to the `queryMaker` function, ensure that the token includes the user's `_id` and `role` if the user is authenticated. In cases where the user is not authenticated, the token can be set to `null`.

- ### **Step 3: Defining Authorized Selector Fields**

  ```typescript
  const serviceAuthorizedSelectorFields: IQuerySelectorFields = {
    select: [],
    populate: [
      ['mentor', ['password']],
      ['category', []],
      ['topics', []],
      ['topics.category', []]
    ]
  }
  ```

  The `serviceAuthorizedSelectorFields` configuration defines authorized selector fields for controlling the selection and population of specific document attributes in the query results.

  - The `select` key is an array that specifies which fields are not allowed to be queried using the `select` query parameter. It is used to restrict the selection of specific document attributes in the query results. For instance, on a user collection, the "password" field is an essential document attribute that should not be accessible through query parameters. By adding "password" to the `select` array, you prevent it from being queried and retrieved. It's important to note that for fields you do not want to share, you should also set them as `"select: false"` in your schema. This ensures that these fields are not accessible from the query.

  - The `populate` key is an array of tuples. The first parameter of each tuple indicates the field that can be populated using the `populate` query parameter. The second parameter is an array of fields that should not be shared with the front end when populating. For example, you can specify that the "mentor" field can be populated, but you do not want to share the "password" attribute when populating the "mentor" field.

    **Populating Document Fields**

    One of the powerful features of the Mongoose Query Maker is the ability to populate document fields, allowing you to retrieve related data along with your query results. This feature enhances the richness of the data you can access and is particularly useful for scenarios where data is distributed across multiple collections.

    With the "populate" feature, you can:

    - Populate with Main Key: You can specify the main key that you want to populate. This is a straightforward way to retrieve data associated with the main key.

    - Populate with Nested Object Key: When your documents contain nested objects, you can still populate fields within those nested objects, making it easy to access deeply nested data.

    - Populate with an Array of Keys: If your documents have arrays of data, you can specify which keys within the array should be populated, giving you control over the data you retrieve.

    - Populate with Nested Populate: Sometimes, you may need to access data from nested populations. The Mongoose Query Builder supports this, allowing you to populate fields within nested populations to retrieve even more detailed information.

    The "populate" feature provides flexibility in accessing related data, giving you the ability to tailor your query results to match the specific needs of your application. It's a versatile tool for building rich and meaningful responses to your queries.

  This configuration allows you to fine-tune the access permissions for selecting and populating document attributes, enhancing data security and privacy. Remember to set fields you don't want to share as `"select: false"` in your schema to ensure they are not accessible from the query.

  **Important Note: TypeScript Key Suggestions**

  Please note that the Mongoose Query Maker currently does not provide TypeScript key suggestions for the "select" and "populate" fields. However, it does support the specified structure for building these fields.

  While TypeScript key suggestions can be a helpful feature, the Mongoose Query Maker relies on the defined structure to determine how to handle "select" and "populate" fields. Therefore, it's important to ensure that the structure of these fields adheres to the guidelines provided in the documentation to achieve the desired results.

  Rest assured that despite the lack of automatic key suggestions, the Mongoose Query Maker allows you to configure "select" and "populate" fields effectively, granting you fine-grained control over query results and data retrieval.

```typescript
const serviceAuthorizedFields: IQueryMakerFields<iService, iRole> = {
  all: 'OPEN',
  filter: [
    ['category', ['$eq', '$in'], 'OPEN'],
    ['mentor', ['$eq'], 'OPEN'],
    ['status', ['$eq'], 'OPEN'],
    ['packages.price', ['$gt', '$gte', '$lt', '$lte'], 'OPEN'],
    ['title', ['$regex'], 'OPEN']
  ]
}

const serviceSelectorFields: IQuerySelectorFields = {
  select: [],
  populate: [
    ['mentor', ['password']],
    ['category', []],
    ['topics', []],
    ['topics.category', []]
  ]
}

const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  const data = queryMaker(req.query, req.user, serviceAuthorizedFields, serviceSelectorFields)

  const { query, pagination, selector } = data
  const { page, limit, skip, sort } = pagination
  const { select, populate } = selector

  const result = await Service.find(query)
    .select(select)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .populate(populate)

  res.send(result)
}
```

## `2) queryPagination()` Implementation

The "queryPagination" function is designed to streamline the pagination process for your queries. It takes the "req.query" object received from an Express request and processes pagination parameters such as "page," "limit," and "sort."

**Key Functionality:**

- **Page**: It determines the current page number for paginating query results.
- **Limit**: Specifies the number of items to be displayed per page, allowing fine-grained control over result granularity.
- **Skip**: Calculates the number of items to skip in the database query, ensuring data retrieval starts from the correct position.
- **Sort**: Defines the order in which data is presented, making it easier to organize and understand query results.

The "queryPagination" function simplifies the handling of pagination parameters, ensuring that your data is presented in an organized and user-friendly manner. Default values for pagination parameters, as discussed in the documentation, are automatically applied, further enhancing the efficiency of data retrieval.

## `3) querySelector()` Implementation

The "querySelector" function plays a crucial role in defining the fields that can be selected and populated in your queries. Much like the "queryMaker" function, it processes the "req.query" object received from an Express request, as well as the "AuthorizedSelectorFields" configuration, to facilitate the selection and population of fields.

**Key Functionality:**

- **Select Fields**: This function allows you to specify which fields can be selected, providing fine-grained control over the data to include or exclude in query results.

- **Populate Fields**: Similar to field selection, the "querySelector" function also governs which fields can be populated. You can specify which fields are eligible for population, helping manage nested and related data.

- **Exclusion Rules**: Fields that should not be shared with the frontend can be defined, ensuring that sensitive or unnecessary data remains protected. The "select:false" configuration is essential for excluding fields from the query results.

The "querySelector" function enhances your ability to tailor the results of your queries by providing options for field selection and population. It helps ensure that data retrieval aligns with your application's requirements and data privacy considerations.

### **Note:**

- "querySelector" is typically employed when you specifically want to control the select and populate functionality in your queries. It provides the means to fine-tune field selection and population as required for your application.

- On the other hand, "queryPagination" is used primarily for managing pagination data within your queries. If your main focus is on controlling how data is paginated, this function simplifies the process.

- However, for a comprehensive solution that covers all aspects of query creation, including filtering, pagination, field selection, and population, `queryMaker` is the all-in-one function to turn to.

## Contributing

We welcome contributions from the community. If you want to contribute to this project, please contact us.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions, feedback, or support, please feel free to contact at [personal.sifat@gmail.com](mailto:personal.sifat@gmail.com).

#### Thank you for using Mongoose Query Maker!
