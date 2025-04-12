import Navbar from "@/components/custom/navbar"
import { useAtom } from "jotai"

 const Contact = () => {
  const [count, setCount] = useAtom(countAtom);
   return (
     <div>
        <Navbar />
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
     </div>
   )
 }

 export default Contact
