import { NextApiRequest, NextApiResponse } from 'next'

import { buildUserPasswordRecoveryController } from './factory'
import { UserPasswordRecoveryControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST': {
      const requestDto: UserPasswordRecoveryControllerRequest = req.body
      const controller = buildUserPasswordRecoveryController(res)
      controller.recovery(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
