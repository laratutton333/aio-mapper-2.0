import type { VercelRequest, VercelResponse } from "@vercel/node";
import { setCorsHeaders } from "../../serverless/cors";
import { buildDemoUser } from "../../serverless/demo-user";

function sendMethodNotAllowed(res: VercelResponse) {
  res.status(405).json({ error: "Method not allowed" });
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const actionParam = req.query.action;
  const action = Array.isArray(actionParam) ? actionParam[0] : actionParam;

  if (!action) {
    return res.status(400).json({ error: "Action is required" });
  }

  const user = buildDemoUser();

  switch (action) {
    case "login":
      if (req.method !== "POST") {
        return sendMethodNotAllowed(res);
      }
      return res.status(200).json({ user });
    case "signup":
      if (req.method !== "POST") {
        return sendMethodNotAllowed(res);
      }
      return res.status(201).json({ user });
    case "logout":
      if (req.method !== "POST") {
        return sendMethodNotAllowed(res);
      }
      return res.status(200).json({ success: true });
    case "user":
      if (req.method !== "GET") {
        return sendMethodNotAllowed(res);
      }
      return res.status(200).json(user);
    default:
      return res.status(404).json({ error: "Action not found" });
  }
}
