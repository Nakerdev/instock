import { NextApiRequest, NextApiResponse } from 'next'

import { buildSearchProductsController } from './factory'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'GET': {
      const controller = buildSearchProductsController(res, req)
      controller.search()
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
