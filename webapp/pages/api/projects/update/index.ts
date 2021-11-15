import { NextApiRequest, NextApiResponse } from 'next'

import { buildUpdateProjectController } from './factory'
import { ProjectUpdatingControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'PUT': {
      const requestDto: ProjectUpdatingControllerRequest = req.body
      const controller = buildUpdateProjectController(res, req)
      controller.update(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
};
