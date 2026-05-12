interface Neighborhood {
  id: string;
  name: string;
  image: string;
  description?: string;
  priceRange?: string;
  gridClass?: string;
}

const DEFAULT_AREAS = [
  {
    id: '1',
    name: 'Leppington',
    priceRange: '$900k — $1.8M',
    description:
      'The heart of the South West, offering seamless connectivity and premium modern living for growing families.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBrghhNyWymY9RP9QoqpVd9nLtSwusQMMJlgrdwi3TYrAkPWxOl6geHVGOMGlYXrzeWSvb3KGpb7jnyL9x2_ogCZnRpINWpRth29xK873DxQvGXkXPG3uc9sige2FiTxt_Vp4ldSKZTCKsynZhceWr35TOysmOyJekrmZpDWgyxrwrTeKud8EeJeSdxLfjDCDavuyfo6CrcDL7n1Wu_V35VPGV1GkgtGnAjuObv0vucIUQmisHCVm3TuztLmECB39R3sQa-x9sn5nM',
  },
  {
    id: '2',
    name: 'Oran Park',
    priceRange: '$850k — $1.6M',
    description:
      'A vibrant, master-planned town center designed with lifestyle, work, and recreation in perfect balance.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUXGmna6KoGwMH1Ap7oC-E1z8TDa6fBmHaDvAIUESlW72VSEvoj_VSvfvklootiacmT8BBWTu8wruroviI2wuagrSPde2fBzkVm_oQ7iCI6x72g3tR4WDvpwLLesmZRWXiVFxCnzHdh_EJ8r1oVTIe_ad_oBKjDO6MouAKN-IJ-Fp2uj1UaqloIlcYR1o-ljANMA243Xt98pejqS2KjVZrvqqEyhz1YDKrkdnANJDdW_78BMoEe1OBYBsmLbk9dPouxhw3YE6td8Q',
  },
  {
    id: '3',
    name: 'Austral',
    priceRange: '$800k — $1.5M',
    description:
      'Quiet residential serenity met with immense future growth potential near the new airport precinct.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSgSwaLSINC__IiTRwQh-s0MZpWdF19rRPOYqckUBKPq31zUei0OP92EbImxbRlHzR0DtSbGv1y9adhbRr6lRuJvOuVQGNUhslnB31_UuenF8o_-yXdtIpXf3-6dbvCEE8AUwQgCe2LNF6K-qxnHmetaNWKI6PqhS98VNZWem_dDh0j5wZt19LqTIbT6OWSmFU497-Y5eOsnwhxLoui7R2deBFP7lC-V_kFpZygRWJHr3xIAYcI2ixVFWjez1kNHMGDgtxzILdNIg',
  },
];

interface PopularNeighborhoodsProps {
  neighborhoods?: Neighborhood[];
}

export default function PopularNeighborhoods({ neighborhoods }: PopularNeighborhoodsProps) {
  // Use passed neighborhoods if they have useful data, otherwise fall back to defaults
  const areas =
    neighborhoods && neighborhoods.length > 0 && neighborhoods[0].description
      ? neighborhoods
      : DEFAULT_AREAS;

  return (
    <section className="py-[120px] bg-surface-container-low" id="expertise">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[80px]">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="label-caps tracking-widest text-black">Growth Corridors</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mt-6">Areas of Expertise</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          {areas.map((area, i) => (
            <div
              key={area.id ?? i}
              className="bg-white rounded-xl overflow-hidden soft-shadow group cursor-pointer"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-10 space-y-4">
                <h4 className="text-2xl font-semibold">{area.name}</h4>
                {area.priceRange && (
                  <p className="label-caps text-secondary tracking-widest">{area.priceRange}</p>
                )}
                {area.description && (
                  <p className="text-on-surface-variant leading-relaxed">{area.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
