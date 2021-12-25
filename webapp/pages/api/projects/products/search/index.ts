import { NextApiRequest, NextApiResponse } from 'next'

import { buildSearchProductsController } from './factory'
import { RequestDto } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'GET': {
      const requestDto: RequestDto = req.body
      const controller = buildSearchProductsController(res, req)
      controller.search(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
