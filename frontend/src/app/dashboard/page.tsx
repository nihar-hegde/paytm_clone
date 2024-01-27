import { cookies } from "next/headers";
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const token = cookies().get("jwtToken")?.value;

  if (!token) return <p>Not Logged in</p>;

  return <div className="flex items-center justify-center">{token}</div>;
};

export default DashboardPage;
