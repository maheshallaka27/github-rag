const requests = new Map();

const rateLimiter = (limit, windowMs) => {
  return (req, res, next) => {
    const key = req.ip;

    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const timestamps = requests.get(key);

    // Remove requests outside the current window
    const validRequests = timestamps.filter(
      (timestamp) => now - timestamp < windowMs,
    );

    if (validRequests.length >= limit) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    validRequests.push(now);
    requests.set(key, validRequests);

    next();
  };
};

export default rateLimiter;
