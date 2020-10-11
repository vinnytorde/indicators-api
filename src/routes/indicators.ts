import express, { Request, Response } from 'express'
import * as indicatorController from '../controllers/indicators'

const Router: express.Router = express.Router()

Router.get('/query', indicatorController.query)

export default Router
