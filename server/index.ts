// import http from 'http'
// import next from 'next'
import createApp from './app'

const PORT = process.env.PORT || 3000

const env = process.env.NODE_ENV
const dev = env !== 'production'

const ROOT_URL = dev ? `http://localhost:${PORT}` : 'https://sorcererxw.com'

console.log(`dev: ${dev}`)

createApp()
  .then(app => app.listen(3000))
  .then(() => console.log(`> Ready on ${ROOT_URL} [${env}]`))
  .catch(err => console.error(err))
