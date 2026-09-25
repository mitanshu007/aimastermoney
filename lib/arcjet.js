import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY || "",
  characteristics: ["userId"], // Track requests by a custom userId
  rules: [
    // Rate limit configuration: 10 requests every 60 seconds with 10 tokens capacity
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 10,
    }),
  ],
});

export default aj;
