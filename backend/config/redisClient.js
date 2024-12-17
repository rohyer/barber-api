const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://redis:6379"
});

redisClient.on("error", (error) => {
  console.log("Erro ao conectar no redis", error);
});

redisClient.connect();

module.exports = redisClient;
