export default function BannerSection({ image }) {
  return (
    <div className="rounded-xl overflow-hidden shadow mb-6">
      <img src={image} alt="Banner" className="w-full h-52 md:h-72 object-cover" />
    </div>
  );
}