const redisClient = require("../config/redisClient");

const cacheMiddleware = async (req, res, next) => {
  // const id = req.params.id;
  const prefix = req.originalUrl;
  const cacheKey = prefix;

  try {
    const cachedData = await redisClient.get(cacheKey);

    req.cacheKey = cacheKey;

    if (cachedData) {
      console.log(`Resposta do cache para ${cachedData}`);
      return res.json(JSON.parse(cachedData));
    }

    // Continua para a lógica principal se não houver cache
    next();
  } catch (error) {
    console.log(`Erro ao verificar o cache ${prefix}`, error);
    next();
  }
};

module.exports = { cacheMiddleware };
