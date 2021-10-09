import { NextApiRequest, NextApiResponse } from "next";
import { buildUserSignUpController } from "./factory";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const criteria = extractCriteriaParamFrom(req);
      const controller = buildMoviesController(res);
      const moviesRequest = new MoviesControllerRequest(criteria);
      controller.search(moviesRequest);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

function extractCriteriaParamFrom(req: NextApiRequest) {
  const { criteria } = req.query;
  return Array.isArray(criteria) ? "" : criteria;
}
