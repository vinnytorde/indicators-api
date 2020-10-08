import express, { Request, Response } from 'express'

const Router: express.Router = express.Router()

enum Status {
  ALIVE = 'alive',
  READY = 'ready',
}

Router.get('/liveness', (req: Request, res: Response) => {
  return res.status(200).send({ status: Status.ALIVE })
})

Router.get('/readiness', (req: Request, res: Response) => {
  return res.status(200).send({ status: Status.READY })
})

export default Router
