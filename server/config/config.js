var env = process.env.NODE_ENV || "development";

if (env === "development") {
  process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://ppyxmw:VeicKegsAdCeic3@ds133630.mlab.com:33630/todoapp';
} else if (env === "test") {
  process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://ppyxmw:VeicKegsAdCeic3@ds119160.mlab.com:19160/todoapptest';
}
