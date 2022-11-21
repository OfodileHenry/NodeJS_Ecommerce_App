module.exports = {
  database:
    "mongodb+srv://henry:jehovahnissi5@emaily-dev-cluster.hzwfi.mongodb.net/ecommerce",
  port: 3000,
  secretKey: "abc123",
  facebook: {
    clientID: process.env.FACEBOOK_ID || "2145788745623766",
    clientSecret:
      process.env.FACEBOOK_SECRET || "e1d8b49487bc1ab203ea5834ed7d0acc",
    profileFields: ["emails", "displayName"],
    callbackURL: "http:localhost:3000/auth/facebook/callback",
  },
};
