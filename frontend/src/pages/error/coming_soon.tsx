export default function Error404() {
  return (
    <div className="relative w-screen h-screen bg-[#cfcfcd] flex items-center justify-center select-none overflow-hidden">
      {/* Background image for mobile */}
      <div className="absolute inset-0 sm:hidden bg-[url('/images/error_screen/1.jpg')] bg-cover bg-center opacity-30"></div>

      {/* Normal image for desktop */}
      <img
        src="/images/error_screen/1.jpg"
        alt="Error 404"
        draggable="false"
        className="hidden sm:block sm:h-full sm:w-auto object-cover"
      />

      <h1 className="absolute top-50 sm:top-30 text-5xl sm:text-7xl font-black sm:font-extrabold text-black text-center px-4">
        Coming Soon...
      </h1>
    </div>
  );
}
