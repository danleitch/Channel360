import { NextFunction, Request, Response } from "express";
import { Counter, Gauge, Histogram } from "prom-client";

const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "endpoint", "status_code"],
});

const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "endpoint", "status_code"],
  buckets: [0.1, 0.5, 1, 5, 10], // Define your own buckets based on your requirements
});

const httpRequestsInProgress = new Gauge({
  name: "http_requests_in_progress",
  help: "HTTP requests in progress",
  labelNames: ["method", "endpoint"],
});

export const httpPerformanceObserver = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = process.hrtime();
  httpRequestsInProgress.inc({ method: req.method, endpoint: req.path });

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInSeconds = seconds + nanoseconds / 1e9;
    httpRequestDurationSeconds.observe(
      {
        method: req.method,
        endpoint: req.path,
        status_code: res.statusCode,
      },
      durationInSeconds,
    );
    httpRequestsTotal.inc({
      method: req.method,
      endpoint: req.path,
      status_code: res.statusCode,
    });
    httpRequestsInProgress.dec({ method: req.method, endpoint: req.path });
  });

  next();
};
