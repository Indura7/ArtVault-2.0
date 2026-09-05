export interface Artwork {
  id: number | string;
  title: string;
  type: string;
  price: string | number;
  image: string;
}

export interface ArtistProfile {
  id: string;
  name: string;
  handle: string;
  image: string;
  tags: string[];
  bio: string;
  artworksCount: number;
  followersCount: string;
  location?: string;
  email?: string;
  category?: string;
  artworks: Artwork[];
}

export const INITIAL_CREATORS: ArtistProfile[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    handle: '@vance_studio',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    tags: ['ABSTRACT', 'MINIMALISM'],
    bio: "Specializing in monochromatic spatial explorations, Elena's work bridges the gap between physical architecture and human emotion through subtle geometric balances.",
    artworksCount: 124,
    followersCount: '14.2k',
    location: 'Berlin, Germany',
    email: 'elena@vance.studio',
    category: 'Abstract & Minimalism',
    artworks: [
      { id: 1, title: 'Spatial Equilibrium I', type: 'Abstract', price: '45,000 LKR', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Monochrome Void IV', type: 'Minimalism', price: '62,000 LKR', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Silence in White', type: 'Minimalism', price: '38,500 LKR', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop' },
      { id: 4, title: 'Geometric Fracture', type: 'Abstract', price: '54,000 LKR', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'kaito-morii',
    name: 'Kaito Morii',
    handle: '@kaito_vis',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop',
    tags: ['SURREALISM', 'NEON-NOIR'],
    bio: "A pioneer of Neo-Tokyo surrealism, Kaito's digital pieces explore the intersection of artificial intelligence and organic consciousness with radiant neon palettes.",
    artworksCount: 89,
    followersCount: '22.8k',
    location: 'Tokyo, Japan',
    email: 'kaito@morii.design',
    category: 'Neon-Noir Digital Art',
    artworks: [
      { id: 1, title: 'Cyber Pulse 2099', type: 'Neon-Noir', price: '75,000 LKR', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Neon Rain Reverie', type: 'Surrealism', price: '88,000 LKR', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Sentient Luminescence', type: 'Digital Art', price: '92,000 LKR', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop' },
      { id: 4, title: 'Tokyo Grid Echo', type: 'Neon-Noir', price: '64,000 LKR', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'sarah-sterling',
    name: 'Sarah Sterling',
    handle: '@sterling_lens',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    tags: ['REALISM', 'DIGITAL PHOTO'],
    bio: 'Sarah captures the hyper-realistic textures of the natural world, focusing on macroscopic details that are often overlooked by the fast pace of modern life.',
    artworksCount: 210,
    followersCount: '31.5k',
    location: 'Vancouver, Canada',
    email: 'sarah@sterlinglens.art',
    category: 'Fine Art Photography',
    artworks: [
      { id: 1, title: 'Alpine Mist Horizon', type: 'Photography', price: '34,000 LKR', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Emerald Canopy', type: 'Realism', price: '41,000 LKR', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Frozen Glacier Echo', type: 'Digital Photo', price: '52,000 LKR', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    handle: '@mchen_paints',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
    tags: ['EXPRESSIONISM'],
    bio: 'Marcus utilizes traditional oil techniques to recreate digital glitches, creating a jarring yet beautiful tension between history and contemporary tech.',
    artworksCount: 56,
    followersCount: '18.9k',
    location: 'New York, USA',
    email: 'marcus@chenart.com',
    category: 'Oil Expressionism',
    artworks: [
      { id: 1, title: 'Glitch in Raw Sienna', type: 'Oil Painting', price: '68,000 LKR', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Analog Artifact #9', type: 'Expressionism', price: '72,000 LKR', image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Static in Vermillion', type: 'Fine Art', price: '85,000 LKR', image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'zoe-aris',
    name: 'Zoe Aris',
    handle: '@aris_renders',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    tags: ['3D RENDERING', 'CYBERPUNK'],
    bio: 'Zoe creates hyper-detailed 3D environments that feel like forgotten memories of a future city, using complex lighting algorithms and architectural forms.',
    artworksCount: 142,
    followersCount: '45.1k',
    location: 'London, UK',
    email: 'zoe@arisrenders.io',
    category: 'Cyberpunk & 3D',
    artworks: [
      { id: 1, title: 'Neo-Metropolis 01', type: '3D Render', price: '82,000 LKR', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Hologram Sanctuary', type: 'CGI Art', price: '94,000 LKR', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Prism Overdrive', type: 'Cyberpunk', price: '79,000 LKR', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'lana-volkov',
    name: 'Lana Volkov',
    handle: '@volkov_brush',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    tags: ['IMPRESSIONISM'],
    bio: "Lana's impressionist landscapes are characterized by their dreamlike atmosphere and innovative use of color harmonies that transport viewers into peaceful realms.",
    artworksCount: 77,
    followersCount: '27.4k',
    location: 'Paris, France',
    email: 'lana@volkovfineart.fr',
    category: 'Impressionist Painting',
    artworks: [
      { id: 1, title: 'Lavender Twilight', type: 'Impressionism', price: '48,000 LKR', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop' },
      { id: 2, title: 'Pastel Meadow Echo', type: 'Oil Painting', price: '56,000 LKR', image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop' },
      { id: 3, title: 'Golden Hour Reflection', type: 'Landscape', price: '64,000 LKR', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'mateo-rossi',
    name: 'Mateo Rossi',
    handle: '@rossi_sculpt',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    tags: ['SCULPTURE', 'MODERNISM'],
    bio: 'Sculpting brutalist forms in bronze and recycled marble, Mateo questions permanency in a digital epoch through raw textural contrasts.',
    artworksCount: 64,
    followersCount: '16.5k',
    location: 'Milan, Italy',
    email: 'mateo@rossisculpt.it',
    category: 'Sculpture & Modernism',
    artworks: [
      { id: 1, title: 'Bronze Monolith IV', type: 'Sculpture', price: '120,000 LKR', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    handle: '@amara_canvas',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    tags: ['CONTEMPORARY', 'AFRO-FUTURISM'],
    bio: 'Merging rich traditional textile patterns with futuristic folklore, creating monumental canvases full of vibrant cultural identity.',
    artworksCount: 95,
    followersCount: '29.4k',
    location: 'Dakar, Senegal',
    email: 'amara@diallo.art',
    category: 'Afro-Futurism',
    artworks: [
      { id: 1, title: 'Solace in Indigo', type: 'Afro-Futurism', price: '78,000 LKR', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop' },
    ],
  },
  {
    id: 'tariq-mansoor',
    name: 'Tariq Mansoor',
    handle: '@mansoor_calligraphy',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    tags: ['CALLIGRAPHY', 'MINIMALISM'],
    bio: 'Contemporary Arabic typography deconstructed into sweeping minimalist abstract ink strokes across organic Japanese handmade papers.',
    artworksCount: 112,
    followersCount: '38.2k',
    location: 'Dubai, UAE',
    email: 'tariq@mansoorart.ae',
    category: 'Calligraphy',
    artworks: [
      { id: 1, title: 'Symphony in Kufic IV', type: 'Calligraphy', price: '95,000 LKR', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop' },
    ],
  },
];

export function findArtistBySlug(idOrSlug: string): ArtistProfile | undefined {
  if (!idOrSlug) return undefined;
  const target = decodeURIComponent(idOrSlug).toLowerCase().trim();
  const normalizedTarget = target.replace(/[^a-z0-9]/g, '');

  return INITIAL_CREATORS.find((artist) => {
    const artistId = artist.id.toLowerCase();
    const artistSlug = artist.name.toLowerCase().replace(/\s+/g, '-');
    const artistHandle = artist.handle.toLowerCase().replace(/^@/, '');
    const normalizedName = artist.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      artistId === target ||
      artistSlug === target ||
      artistHandle === target ||
      normalizedName === normalizedTarget ||
      target.includes(artistId) ||
      artistId.includes(target)
    );
  });
}