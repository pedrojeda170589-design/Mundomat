import PaginaLegal from "@/components/legal/PaginaLegal";
import { TERMINOS } from "@/lib/legal/condiciones";

export const metadata = { title: "Términos · MundoTest26" };

export default function TerminosPage() {
  return <PaginaLegal titulo={TERMINOS.titulo} secciones={TERMINOS.secciones} />;
}
