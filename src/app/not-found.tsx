export default function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-canvas text-ink">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red">404</h1>
        <p className="mt-2 text-mute">Trang bạn tìm kiếm không tồn tại.</p>
        <a href="/" className="mt-4 inline-block text-blue hover:underline">Quay lại trang chủ</a>
      </div>
    </div>
  );
}
