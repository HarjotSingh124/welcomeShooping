"use client";

import { useEffect, useState } from "react";
import { fetchHomepageSections } from "@/firebase/homepageSections";
import ProductRow from "@/components/ProductRow";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import BannerSection from "@/components/BannerSection";


export default function HomePage() {
  const [sections, setSections] = useState([]);
    const [allCategories, setAllCategories] = useState([]);


  useEffect(() => {
    const loadSections = async () => {
      const allSections = await fetchHomepageSections();
      const enabledSections = allSections.filter(sec => sec.enabled).sort((a, b) => a.order - b.order);
      setSections(enabledSections);
    };

    loadSections();
  }, []);

  return (
    <div className="bg-[#EAE7E5] min-h-screen">
      <main className="px-4 py-8 max-w-7xl mx-auto space-y-12">


        {/* Dynamic Sections from Firebase */}
        {sections.map((sec) => {
          if (sec.type === "hero") {
            return <HeroCarousel key={sec.id} images={sec.images || []} />;
          }

          if (sec.type === "banner") {
            return <BannerSection key={sec.id} image={sec.image} />;
          }
if (sec.type === "categoryGrid") {
  const displayCategories = (sec.categories || [])
    .map((slug) => {
      const matched = allCategories.find((cat) => cat.slug === slug);
      return matched || { slug, name: slug, icon: "🛍️" };
    });

  return (
    <CategoryGrid
      key={sec.id}
      title={`${sec.icon || ""} ${sec.title}`}
      categories={displayCategories}
    />
  );
}
          if (sec.type === "productRow") {
            return (
              <div
                key={sec.id}
                className="p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
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
        })}

        {/* Footer */}
        <footer className="pt-10 pb-6 text-center text-sm text-gray-500 border-t mt-10">
          © {new Date().getFullYear()} WelcomeShopping. All rights reserved.
        </footer>
      </main>
    </div>
  );
}