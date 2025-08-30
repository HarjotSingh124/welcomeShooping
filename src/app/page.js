// "use client";

// import { useEffect, useState } from "react";
// import { fetchHomepageSections } from "@/firebase/homepageSections";
// import ProductRow from "@/components/ProductRow";
// import HeroCarousel from "@/components/HeroCarousel";
// import CategoryGrid from "@/components/CategoryGrid";
// import BannerSection from "@/components/BannerSection";
// import { useAuth } from "@/context/AuthContext"; // Import Auth Context
// import { useRouter } from "next/navigation"; // Use Next.js router for navigation
// import SkeletonLoader from "@/components/SkeletonLoader"; 
// import Footer, {footer} from "@/components/Footer"; // Import Footer component
// // New Loader Component

// export default function HomePage() {
//   const [sections, setSections] = useState([]);
//   const [allCategories, setAllCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//     const { user } = useAuth();

//   useEffect(() => {
//     const loadSections = async () => {
//       const allSections = await fetchHomepageSections();
//       const enabledSections = allSections
//         .filter((sec) => sec.enabled)
//         .sort((a, b) => a.order - b.order);

//       setSections(enabledSections);
//       setLoading(false);
//     };

//     loadSections();
//   }, []);

//   return (
//     <div className="bg-[#EAE7E5] min-h-screen">
//       <main className="px-4 py-8 max-w-7xl mx-auto space-y-12">
//         {/* Loading Skeleton */}
//         {loading ? (
//           <>
//             <SkeletonLoader type="hero" />
//             <SkeletonLoader type="banner" />
//             <SkeletonLoader type="categoryGrid" />
//             <SkeletonLoader type="productRow" count={2} />
//           </>
//         ) : (
//           sections.map((sec) => {
//             if (sec.type === "hero") {
//               return <HeroCarousel key={sec.id} images={sec.images || []} />;
//             }
//             if (sec.type === "banner") {
//               return <BannerSection key={sec.id} image={sec.image} />;
//             }

//             if (sec.type === "categoryGrid") {
//               const displayCategories = (sec.categories || []).map((slug) => {
//                 const matched = allCategories.find((cat) => cat.slug === slug);
//                 return matched || { slug, name: slug, icon: "🛍️" };
//               });

//               return (
//                 <CategoryGrid
//                   key={sec.id}
//                   title={`${sec.icon || ""} ${sec.title}`}
//                   categories={displayCategories}
//                 />
//               );
//             }

//             if (sec.type === "productRow") {
//               return (
//                 <div
//                   key={sec.id}
//                   className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
//                 >
//                   <ProductRow
//                     category={sec.category}
//                     title={`${sec.icon || ""} ${sec.title}`}
//                     limit={sec.limit || 10}
//                   />
//                 </div>
//               );
//             }
     

//             return null;
//           })
//         )}

//         {/* Footer */}

//       </main>
   
//     </div>

      
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { fetchHomepageSections } from "@/firebase/homepageSections";
import ProductRow from "@/components/ProductRow";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import BannerSection from "@/components/BannerSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function HomePage() {
  const [sections, setSections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const loadSections = async () => {
      const allSections = await fetchHomepageSections();
      const enabledSections = allSections
        .filter((sec) => sec.enabled)
        .sort((a, b) => a.order - b.order);

      setSections(enabledSections);
      setLoading(false);
    };

    loadSections();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto space-y-16">
        {/* Loading Skeleton */}
        {loading ? (
          <>
            <SkeletonLoader type="hero" />
            <SkeletonLoader type="banner" />
            <SkeletonLoader type="categoryGrid" />
            <SkeletonLoader type="productRow" count={2} />
          </>
        ) : (
          sections.map((sec) => {
            if (sec.type === "hero") {
              return (
                <div
                  key={sec.id}
                  className="animate-fadeIn"
                >
                  <HeroCarousel images={sec.images || []} />
                </div>
              );
            }

            if (sec.type === "banner") {
              return (
                <div
                  key={sec.id}
                  className="animate-fadeIn"
                >
                  <BannerSection image={sec.image} />
                </div>
              );
            }

            if (sec.type === "categoryGrid") {
              const displayCategories = (sec.categories || []).map((slug) => {
                const matched = allCategories.find((cat) => cat.slug === slug);
                return matched || { slug, name: slug, icon: "🛍️" };
              });

              return (
                <div key={sec.id} className="animate-fadeIn">
                  <CategoryGrid
                    title={`${sec.icon || ""} ${sec.title}`}
                    categories={displayCategories}
                  />
                </div>
              );
            }

            if (sec.type === "productRow") {
              return (
                <div
                  key={sec.id}
                  className="animate-fadeIn bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
                >
                  <ProductRow
                    category={sec.category}
                    title={`${sec.icon || ""} ${sec.title}`}
                    limit={sec.limit || 10}
                  />
                </div>
              );
            }

            return null;
          })
        )}
      </main>
    </div>
  );
}