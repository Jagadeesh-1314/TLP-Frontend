import { Container } from "@mui/material";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth={"xl"} sx={{ marginBlock: "1rem" }}>
      {children}
    </Container>
  );
}
