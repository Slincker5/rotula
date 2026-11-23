import GuardSesion from "@/components/GuardSesion";

export const metadata = {
  title: "Rotula - Home",
};

export default function Home({ children }) {
  return (
    <GuardSesion>
      <div>{children}</div>
    </GuardSesion>
  );
}
