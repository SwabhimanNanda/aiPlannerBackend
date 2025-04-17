const addCokkie = (refreshToken, res) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = addCokkie;
