import * as db from "./db";

export const uuid = () => crypto.randomUUID();

export const authHandler = async ({
  name,
  email,
  provider,
  avatar,
}: UserParams) => {
  const { auth: authConfig } = useAppConfig();
  if (!authConfig.providers.includes(provider)) {
    throw createError({
      message: "Provider not allowed",
      status: 403,
    });
  }
  if (!email) {
    throw createError({
      message: `${provider} account must have an email address`,
      status: 400,
    });
  }
  if (authConfig.emails.length && !authConfig.emails.includes(email)) {
    throw createError({
      message: "Email not allowed",
      status: 403,
    });
  }
  const domain = email.split("@")[1];
  if (authConfig.domains.length && !authConfig.domains.includes(domain)) {
    throw createError({
      message: "Email sign in is not allowed",
      status: 403,
    });
  }
  const registeredUser = await db.getUserByEmail(email);
  if (registeredUser) {
    if (registeredUser.status !== "active") {
      throw createError({
        message: "User is not active",
        status: 403,
      });
    }
    return registeredUser;
  } else {
    if (!authConfig.allowSignup) {
      throw createError({
        message: "Sign up is not allowed",
        status: 403,
      });
    }
    const newUser: CreateUserType = {
      id: uuid(),
      name,
      email,
      provider,
      avatar,
      createdAt: new Date(),
    };
    await db.createUser(newUser);
    return newUser;
  }
};
