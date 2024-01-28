import { getAllUsers } from "@/actions/users.actions";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Home = async () => {
  const users = await getAllUsers();
  return (
    <main
      className="flex h-full flex-col items-center justify-center 
bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"
    >
      <Link
        href={"/auth/sign-in"}
        className={buttonVariants({ variant: "secondary" })}
      >
        Sign-In
      </Link>
    </main>
  );
};

export default Home;
