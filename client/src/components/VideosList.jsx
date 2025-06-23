import axios from "axios";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const VideosList = () => {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    totalVideos: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/video?page=${page}&limit=${pagination.limit}`);
      if (res?.data) {
        setVideos(res.data.videos);
        setPagination({
          page: res.data.page,
          limit: res.data.limit,
          totalVideos: res.data.totalVideos,
          totalPages: res.data.totalPages
        });
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchVideos(newPage);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Videos</h2>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.length === 0 ? (
              <div className="col-span-3 text-center py-10">No videos found</div>
            ) : (
              videos.map((video) => (
                <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative aspect-video">
                    <video
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={video.videoUrl} type={`video/${video.videoUrl.split(".").pop()}`} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                    <p className="text-gray-600 text-sm">{video.description}</p>
                    {video.userId && (
                      <p className="text-gray-500 text-xs mt-2">Uploaded by: {video.userId.name}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border rounded-md ${
                      pageNum === pagination.page ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideosList;