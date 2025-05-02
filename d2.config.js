const config = {
  baseUrl: 'https://play.dhis2.org/stable-2.41.3.1', // ✅ no "/api" at the end
  apiVersion: 37,
  auth: {
      username: 'admin',
      password: 'district'
  },
  type: 'app',
  entryPoints: {
      app: './src/App.js',
  },
}

module.exports = config
