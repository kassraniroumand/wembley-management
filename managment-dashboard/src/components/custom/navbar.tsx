import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [count, _] = useAtom(countAtom);

  return (
    <div>
      <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Login">login</Link>
        </li>
      </ul>
    </nav>
    </div>
  );
}

export default Navbar
