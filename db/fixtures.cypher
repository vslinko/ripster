CREATE CONSTRAINT ON (u:User) ASSERT u.uuid IS UNIQUE;
CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE;
CREATE CONSTRAINT ON (s:Session) ASSERT s.sid IS UNIQUE;

CREATE (user:User {
  uuid: "e61d795e-fdf8-4cb7-a280-8542e66ebb25",
  email: "user1@example.com",
  password: "$2a$10$B1bMw3pBC1aNBrQ18jMvx.STNEqq5v7QtRpt9hzIe5uPcrBqRL43.",
  role: "USER"
})

CREATE (admin:User {
  uuid: "e624a76a-e5c0-4388-bd02-612e55dc2299",
  email: "user2@example.com",
  password: "$2a$10$r4nBygb8e1CugqXhG6H.2OCLeKn9XseTatKL1xeNrmkYfqovtZ8pC",
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
