const config = {

    baseUrl: 'https://play.im.dhis2.org/stable-2-41-3-1/api',
    apiVersion: 41,
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
