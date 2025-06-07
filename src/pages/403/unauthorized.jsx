import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Không có quyền</h1>
        <p className="text-gray-600 mb-6">Bạn không có quyền truy cập vào trang này</p>
        <div>
          <button
            onClick={goBack}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Trở lại
          </button>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
