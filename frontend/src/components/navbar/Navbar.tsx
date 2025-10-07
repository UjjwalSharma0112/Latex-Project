import { Play } from "lucide-react";
import { FaGithub } from "react-icons/fa";
type NavbarProps = {
  handleCompile: React.MouseEventHandler<HTMLButtonElement>;
};
function Navbar({ handleCompile }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Editor
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={handleCompile}
          className="flex items-center gap-2 px-5 py-2 bg-zinc-800 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          aria-label="Compile"
        >
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Compile</span>
          </>
        </button>
        <a
          href="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <FaGithub className="h-6 w-6" />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
