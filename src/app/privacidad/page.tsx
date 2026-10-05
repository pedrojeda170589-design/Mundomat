import PaginaLegal from "@/components/legal/PaginaLegal";
import { PRIVACIDAD } from "@/lib/legal/condiciones";

export const metadata = { title: "Política de privacidad · MundoTest26" };

export default function PrivacidadPage() {
  return <PaginaLegal titulo={PRIVACIDAD.titulo} secciones={PRIVACIDAD.secciones} />;
}
