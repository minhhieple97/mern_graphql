const express = require("express")
const cryprto = require("crypto")
const { graphqlHTTP } = require("express-graphql") //đóng vai trò như middleware, nó sẽ handled các request dạng graphql từ client
const app = express()
const { buildSchema } = require("graphql")
const { dataUsers, dataMessage } = require("./db")
const schema = buildSchema(` 
 type Query {
     users: [User!]!
     user(id:ID!): User 
     messages:[Message!]!
 }
 type User {
     id: ID!
     email: String!
     name: String
     username: String
     phone:String
     messages: [Message]
 }
 type Message {
  id: ID!
  content: String!
  userId: ID!
}
 type Mutation {
   addUser(email:String!,name:String,username:String,phone:String): User
 }
`)
// Trong buildSchema thì sẽ có mặc định luôn có type Query mô tả những gì sẽ trả về cho client, nó sẽ bao gồm những gì và trường dữ liệu đó có kiểu giá trị như thế nào ?
// Bạn sẽ tự define ra các loại type khác, hiểu đơn giản buildSchema sẽ cho phép bạn định nghĩa nên các schema,
const rootValue = {
  // Nguồn cấp dữ liệu
  users: () => dataUsers.map((el) => new User(el)),
  messages: () => dataMessage,
  user: ({ id }) => {
    console.log(id)
    const user = dataUsers.find((el) => {
      console.log(el.id)
      return el.id.toString() === id
    })
    return user
  },
  addUser: ({ email, phone, name, username }) => {
    const user = {
      id: cryprto.randomBytes(10).toString(),
      email,
      phone,
      name,
      username,
    }
    dataUsers.push(user)
    return user
  },
}
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
)
class User {
  constructor(user) {
    Object.assign(this, user)
  }
  get messages() {
    return dataMessage.filter((message) => message.userId === this.id)
  }
}
app.listen(3000, () => {
  console.log("Server is listening on port 3000")
})
