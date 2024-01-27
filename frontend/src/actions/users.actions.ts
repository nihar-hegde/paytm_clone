"use server";

export const getAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/user/bulk");
    const users = await response.json();
    return users;
  } catch (error) {
    console.log(error);
  }
};
