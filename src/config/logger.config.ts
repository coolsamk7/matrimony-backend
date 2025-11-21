export default {
  pinoHttp: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
              singleLine: false,
            },
          }
        : undefined,
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    customProps: () => ({
      context: 'HTTP',
    }),
    autoLogging: {
      ignore: (req) => req.url === '/api/v1/health',
    },
  },
};
