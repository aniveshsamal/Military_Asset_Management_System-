import { useLocation } from "react-router-dom";

function PlaceholderPage() {
  const path = useLocation().pathname.replace("/", "") || "page";

  return (
    <div className="text-light">
      <p className="text-secondary mb-0 text-capitalize">
        {path.replace("-", " ")} is not built yet. Use the sidebar to switch
        sections.
      </p>
    </div>
  );
}

export default PlaceholderPage;
