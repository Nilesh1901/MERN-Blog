import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const { theme } = useSelector((store) => store.theme);
  return (
    <div className={theme}>
      <div className=" bg-white text-zinc-700 dark:bg-[rgb(16,23,42)] dark:text-zinc-300 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
