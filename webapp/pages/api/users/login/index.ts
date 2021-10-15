import { NextApiRequest, NextApiResponse } from 'next'

import { buildUserLoginController } from './factory'
import { UserLoginControllerRequest } from './controller'

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'POST':
      const requestDto: UserLoginControllerRequest = req.body
      const controller = buildUserLoginController(res)
      controller.login(requestDto)
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
};
