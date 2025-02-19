
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import DevotionalCard from "@/components/DevotionalCard";
import { format } from "date-fns";

interface Devotional {
  id: string;
  verse: string;
  reference: string;
  reflection: string;
  date: string;
}

const DevotionalPage = () => {
  const { data: devotionals, isLoading, error } = useQuery({
    queryKey: ['devotionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .order('date', { ascending: false }); // Order by date descending
      
      if (error) throw error;
      return data as Devotional[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold mb-4">
            Daily Devotionals
          </h1>
          <p className="text-lg text-muted-foreground">
            Start your day with Scripture and reflection
          </p>
        </section>

        {isLoading && (
          <div className="max-w-2xl mx-auto text-center text-muted-foreground">
            Loading devotionals...
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto text-center text-red-500">
            Error loading devotionals. Please try again later.
          </div>
        )}

        <section className="max-w-2xl mx-auto space-y-8">
          {devotionals?.map((devotional) => (
            <DevotionalCard
              key={devotional.id}
              verse={devotional.verse}
              reference={devotional.reference}
              reflection={devotional.reflection}
              date={format(new Date(devotional.date), 'MMMM d, yyyy')}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default DevotionalPage;
