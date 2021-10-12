import { NextApiRequest, NextApiResponse } from "next";

import { buildUserSignUpController } from "./factory";
import { UserSignUpControllerRequest } from "./controller";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "POST":
      const requestDto: UserSignUpControllerRequest = req.body;
      const controller = buildUserSignUpController(res);
      controller.signUp(requestDto);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};