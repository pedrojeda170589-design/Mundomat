import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MundoTest26 - Videojuego Educativo de 3er grado",
  description:
    "Escuela Hogar Primaria Provincial Rural N°2 - Héroes de Malvinas. El videojuego de la Escuela Hogar para practicar Matemática, Lengua, Ciencias Naturales y Ciencias Sociales de 3er grado.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
