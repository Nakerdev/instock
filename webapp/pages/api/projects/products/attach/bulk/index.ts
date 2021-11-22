import { NextApiRequest, NextApiResponse } from 'next'

import { buildAttachProductsInBulkController } from './factory'
import { AttachProductsInBulkControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST': {
      const requestDto: AttachProductsInBulkControllerRequest = req.body
      const controller = buildAttachProductsInBulkController(res, req)
      controller.attach(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
};
