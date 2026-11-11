import { StatusScreen } from "./StatusScreen";

export function PageNotFound() {
  return <StatusScreen eyebrow="Error 404" title="Page not found" message="We couldn't find this page." />;
}
