import { NextApiRequest, NextApiResponse } from 'next'

import { buildDeleteProductsInBulkController } from './factory'
import { DeleteProductsInBulkControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'DELETE': {
      const requestDto: DeleteProductsInBulkControllerRequest = req.body
      const controller = buildDeleteProductsInBulkController(res, req)
      controller.delete(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
