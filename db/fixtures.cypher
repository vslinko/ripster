CREATE CONSTRAINT ON (u:User) ASSERT u.uuid IS UNIQUE;
CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE;
CREATE CONSTRAINT ON (s:Session) ASSERT s.sid IS UNIQUE;

CREATE (user:User {
  uuid: "e61d795e-fdf8-4cb7-a280-8542e66ebb25",
  email: "user1@example.com",
  password: "$2a$10$AENmBPIy5a13qGkNiyssNeOeYNhASbJTRgVgcs3z5bQl0Im97X7hu",
  role: "USER"
})

CREATE (admin:User {
  uuid: "e624a76a-e5c0-4388-bd02-612e55dc2299",
  email: "user2@example.com",
  password: "$2a$10$p7w8khG4NbcR0xSdy/MK2u33hzkDBCHZwmRJFaVYqNJjbBPuwv3s6",
  role: "ADMIN"
})

CREATE (userSession:Session {
  sid: 'user'
})
CREATE (user)-[:OWNS]->(userSession)

CREATE (adminSession:Session {
  sid: 'admin'
})
CREATE (admin)-[:OWNS]->(adminSession)
