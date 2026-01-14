import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import server from "../server/index";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return server(req, res);
}
