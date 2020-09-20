const { query } = require("express");
const { graphql, buildSchema } = require("graphql");
const { data } = require("./db");
const schema = buildSchema(` 
 type Query {
     users: [User!]!
 }
 type User {
     id: ID!
     email: String!
     name: String
     username: String
 }
`);
// Trong buildSchema thì sẽ có mặc định luôn có type Query mô tả những gì sẽ trả về cho client, nó sẽ bao gồm những gì và trường dữ liệu đó có kiểu giá trị như thế nào ?
// Bạn sẽ tự define ra các loại type khác, hiểu đơn giản buildSchema sẽ cho phép bạn định nghĩa nên các schema,
const rootValue = {
  // Nguồn cấp dữ liệu
  users: () => data,
};
graphql(
  // define nguồn cấp dữ liệu, schema, và các fileld muốn get về
  schema,
  `
    {
      users {
        id
        name
        email
      }
    }
  `,
  rootValue
)
  .then((data) => console.dir(data, { depth: null }))
  .catch(console.log);
