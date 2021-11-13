import { NextApiRequest, NextApiResponse } from 'next'

import { buildDeleteProjectsInBulkController } from './factory'
import { DeleteProjectsInBulkControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST': {
      const requestDto: DeleteProjectsInBulkControllerRequest = req.body
      const controller = buildDeleteProjectsInBulkController(res, req)
      controller.delete(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
};
