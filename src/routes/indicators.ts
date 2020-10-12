import express from 'express'
import * as indicatorController from '../controllers/indicators'

const forwardError = (fn: Function) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    return Promise.resolve(fn(req, res, next)).catch(err => next(err))
  }
}

const Router: express.Router = express.Router()

Router.get('/compare', forwardError(indicatorController.compare))
Router.get('/query', forwardError(indicatorController.query))

export default Router
