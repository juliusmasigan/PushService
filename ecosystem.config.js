module.exports = {
  apps: [{
    name: 'push-service-api',
    script: 'main.js',
    watch: true,
    // Uncomment for a multi-instance implementation.
    // Multi-instance setup needs a load balancer
    // instances: 2,
    // increment_var: 'PORT',
    cwd: 'dist/',
    env: {
      'PORT': 3000,
      'CORS_ENABLED': true,
      'DB_URL': 'mongodb://localhost:32017/master',
      'AUTH0_ISSUER_URL': 'http://server.softrons.com/auth',
      'AUTH0_AUDIENCE': 'auth_api',
      'AUTH0_ALGO': 'RS256',
    },
    env_production: {
      'PORT': 8080,
      'CORS_ENABLED': true,
      'DB_URL': 'mongodb://localhost:32017/master',
      'AUTH0_ISSUER_URL': 'http://server.softrons.com/auth',
      'AUTH0_AUDIENCE': 'auth_api',
      'AUTH0_ALGO': 'RS256',
    },
    error_file: '../log/push-service.error.log',
    out_file: '../log/push-service.log',
    combine_logs: true,
  }],
};
