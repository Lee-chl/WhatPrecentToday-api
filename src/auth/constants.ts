export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? '',
  round: Number(process.env.SALT_ROUND ?? 0),
};
