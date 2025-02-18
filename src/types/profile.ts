
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  church_name: string | null;
  ministry_roles: string[] | null;
  favorite_bible_verse: string | null;
  website_url: string | null;
}
