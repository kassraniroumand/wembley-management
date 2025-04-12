import { useRegion } from "@/hooks/useRegion";



const Region = () => {

  const { useRegions } = useRegion();
  const { data, isLoading, error } = useRegions();

  console.log("data", data);
  console.log("isLoading", isLoading);
  console.log("error", error);

  return (
    <div>
      region
    </div>
  )
}

export default Region
