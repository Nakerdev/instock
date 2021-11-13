import { NextApiRequest, NextApiResponse } from 'next'

import { buildCreateProjectController } from './factory'
import { ProjectCreationControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST': {
      const requestDto: ProjectCreationControllerRequest = req.body
      const controller = buildCreateProjectController(res, req)
      controller.create(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
};
