import localFont from "next/font/local";

export const workSans = localFont({
  src: [
    {
      path: "./WorkSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./WorkSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
});
