import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { reactRouter } from "@react-router/dev/vite";
>>>>>>> a044ffa (Add initial migration files)
=======
>>>>>>> 94f21c6 (Port browser router pages to framework mode)
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
});
