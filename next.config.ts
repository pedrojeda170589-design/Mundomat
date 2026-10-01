import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las fichas en PDF viven fuera de /public (solo se descargan con código
  // de alumno): hay que incluirlas en la función que las entrega.
  outputFileTracingIncludes: {
    "/api/fichas/*": ["./private/fichas/**/*"],
  },
};

export default nextConfig;
