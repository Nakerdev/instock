import { NextApiRequest, NextApiResponse } from 'next'

import { buildUserChangePasswordController } from './factory'
import { UserChangePasswordControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST': {
      const requestDto: UserChangePasswordControllerRequest = req.body
      const controller = buildUserChangePasswordController(res)
      controller.change(requestDto)
      break
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
};
