import { useRouter } from "next/router";

export default function DeviceDetailsPage() {
  const router = useRouter();
  const deviceId = router.query.id;

  // Fetch full device based on ID here

  // return <DeviceDetailed device={}/>
  return <div>{deviceId}</div>;
}
