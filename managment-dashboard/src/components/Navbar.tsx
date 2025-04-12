import { Button } from "./ui/button"
import { Link } from "react-router-dom"
const Navbar = () => {
  return (
    <div>
       <Button>
        <Link to="/">Home</Link>
       </Button>
       <Button>
        <Link to="/region">Region</Link>
       </Button>
    </div>
  )
}

export default Navbar
