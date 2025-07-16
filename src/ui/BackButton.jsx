import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="absolute left-4 top-4 hover:text-amber-700"
      onClick={() => navigate(-1)}
    >
      <HiArrowLeft className="h-6 w-6" />
    </button>
  );
}

export default BackButton;
