import bcrypt from "bcrypt";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return "dev-jwt-secret";
  }

  throw new Error("JWT_SECRET is not defined");
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);