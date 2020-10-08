import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import * as apiController from './controllers/api'
import health from './controllers/health'

const app = express()

app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xssProtection(true))
app.use('/health', health)

app.get('/api', apiController.getApi)

export default app
