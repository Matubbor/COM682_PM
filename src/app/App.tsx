import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { UploadPage } from "./components/UploadPage";
import { GalleryPage } from "./components/GalleryPage";
import { PhotoDetailPage } from "./components/PhotoDetailPage";
import { LoginSignupPage } from "./components/LoginSignupPage";
import type { Trip } from "./api";

export default function App() {
  const [currentPage, setCurrentPage] = useState("Home");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleNavigate = (page: string) => {
    if (page !== "Photo Detail") {
      setSelectedTrip(null);
    }

    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "Home":
        return <HomePage onNavigate={handleNavigate} />;
      case "Upload":
        return <UploadPage />;
      case "My Gallery":
        return (
          <GalleryPage
            onSelectTrip={(trip) => {
              setSelectedTrip(trip);
              setCurrentPage("Photo Detail");
            }}
          />
        );
      case "Login/Signup":
        return <LoginSignupPage />;
      case "Photo Detail":
        return (
          <PhotoDetailPage
            trip={selectedTrip}
            onBack={() => setCurrentPage("My Gallery")}
            onDeleted={() => {
              setSelectedTrip(null);
              setCurrentPage("My Gallery");
            }}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}
