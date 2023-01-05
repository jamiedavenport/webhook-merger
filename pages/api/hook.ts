import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fetch from "node-fetch";

const cache: Record<string, unknown[]> = {};
const key = process.env.CACHE_KEY;

const handler = nc<NextApiRequest, NextApiResponse>()
  .get((req, res) => res.send("Ok"))
  .post(({ body }, res) => {
    const cacheKey = body[key];

    if (!cacheKey) {
      return res.send("OK");
    }

    const c = cache[cacheKey];

    if (!c) {
      cache[cacheKey] = [body];
      setTimeout(() => {
        fetch(process.env.FORWARD_HOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: cache[cacheKey] }),
        });

        delete cache[cacheKey];
      }, process.env.TIMEOUT_SECONDS * 1000);
    } else {
      cache[cacheKey].push(body);
    }

    res.send("OK");
  });

export default handler;
