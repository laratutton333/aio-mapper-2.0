import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool, db } from "../db";
import { users, type User, type SafeUser, signupSchema, loginSchema } from "@shared/models/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const PgSession = connectPgSimple(session);

export function setupAuth(app: Express): void {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }

  app.set("trust proxy", 1);

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    })
  );
}

function toSafeUser(user: User): SafeUser {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.flatten().fieldErrors 
        });
      }

      const { email, password, firstName, lastName } = result.data;

      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const [newUser] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          firstName: firstName || null,
          lastName: lastName || null,
        })
        .returning();

      req.session.userId = newUser.id;

      res.status(201).json({ user: toSafeUser(newUser) });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: result.error.flatten().fieldErrors 
        });
      }

      const { email, password } = result.data;

      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;

      res.json({ user: toSafeUser(user) });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: "User not found" });
      }

      res.json(toSafeUser(user));
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};
