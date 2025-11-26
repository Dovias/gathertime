import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
<<<<<<< HEAD
=======
import { reactRouter } from "@react-router/dev/vite";
>>>>>>> a044ffa (Add initial migration files)
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
});
