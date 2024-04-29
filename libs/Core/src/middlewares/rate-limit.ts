import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Create a map to store rate limiters for each user
const userRateLimiters = new Map();

// Middleware function to apply per-user rate limiting
export const userRateLimiter = () => (req:Request, res:Response, next:NextFunction) => {

    let userId: string;

    if (req.headers.authorization) {
        userId = req.headers.authorization.split(" ")[1];
    } else {
        userId = req.connection.remoteAddress || "";
    }


    // Get or create the rate limiter for the current user
    let limiter = userRateLimiters.get(userId);
    if (!limiter) {
        limiter = new RateLimiterMemory({
            points: 10, // Maximum 10 points (requests) per user
            duration: 1, // Per second
        });
        userRateLimiters.set(userId, limiter);
    }

    // Consume a point from the rate limiter
    limiter.consume(userId)
        .then(() => {
            // The user is within the rate limit, continue to the next middleware
            next();
        })
        .catch(() => {
            // The user has exceeded the rate limit, send an error response
            res.status(429).json({ error: "Too many requests, please try again later." });
        });
};


