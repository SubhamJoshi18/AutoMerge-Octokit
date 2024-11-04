export const extractUserData = (userData: object) => {
  const extractUserData = new Set();

  if (userData['login'] && userData['followers'] && userData['following']) {
    const userPayload = {
      user_name: userData['login'],
      user_follower: userData['followers'],
      user_following: userData['following'],
      public_repo: userData['public_repos'],
      created_at: userData['created_at'],
      updated_at: userData['updated_at'],
      ...userData,
    };
    extractUserData.add(userPayload);
  }

  return Array.from(extractUserData);
};
