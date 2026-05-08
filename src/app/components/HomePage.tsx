interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const img1 = "https://picsum.photos/400/400?random=1";
const img2 = "https://picsum.photos/400/400?random=2";
const img3 = "https://picsum.photos/400/400?random=3";
const img4 = "https://picsum.photos/400/400?random=4";

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="min-h-screen bg-[#f8edcf] text-[#2d1f17]">
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Share Your Travel Memories with TripCloud
          </h1>

          <p className="text-lg mb-8 text-[#5f4b3f]">
            Upload your favourite trip moments, add reviews, rate your
            experience, and keep your travel memories safe in the cloud.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate?.("Upload")}
              className="bg-[#f4cc45] text-[#241817] px-6 py-3 rounded-full font-bold shadow hover:bg-[#e3b92f] transition"
            >
              Upload Trip Post
            </button>

            <button
              onClick={() => onNavigate?.("My Gallery")}
              className="bg-[#00897b] text-white px-6 py-3 rounded-full font-bold shadow hover:bg-[#007267] transition"
            >
              View Gallery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src={img1}
            alt="Travel memory 1"
            className="rounded-2xl shadow-lg w-full h-48 object-cover"
          />
          <img
            src={img2}
            alt="Travel memory 2"
            className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
          />
          <img
            src={img3}
            alt="Travel memory 3"
            className="rounded-2xl shadow-lg w-full h-48 object-cover"
          />
          <img
            src={img4}
            alt="Travel memory 4"
            className="rounded-2xl shadow-lg w-full h-48 object-cover mt-8"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          What You Can Do
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/70 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">📸 Upload Media</h3>
            <p className="text-[#5f4b3f]">
              Add images or videos from your trips and store them safely using
              Azure Blob Storage.
            </p>
          </div>

          <div className="bg-white/70 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">⭐ Add Reviews</h3>
            <p className="text-[#5f4b3f]">
              Write reviews, choose categories, and rate your travel
              experiences.
            </p>
          </div>

          <div className="bg-white/70 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-3">☁️ Cloud Database</h3>
            <p className="text-[#5f4b3f]">
              Trip details are stored in Azure Cosmos DB so your posts can be
              retrieved anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
