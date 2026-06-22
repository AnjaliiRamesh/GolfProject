// 'use client';

// import { createClient } from '@/lib/supabase/client';
// import { Profile } from '@/types';
// import { User } from '@supabase/supabase-js';
// import { useEffect, useState } from 'react';

// export function useUser() {
//   const [user, setUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const supabase = createClient();

//     async function getUserProfile() {
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         setUser(user);

//         if (user) {
//           const { data: profile, error } = await supabase
//   .from('profiles')
//   .select('*')
//   .eq('id', user.id)
//   .single();

// console.log('Profile Data:', profile);
// console.log('Profile Error:', error);

// if (!error) {
//   setProfile(profile as Profile);
// }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     getUserProfile();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           setUser(session.user);
//           const { data: profile } = await supabase
//             .from('profiles')
//             .select('*')
//             .eq('id', session.user.id)
//             .single();
//           setProfile(profile as Profile);
//         } else {
//           setUser(null);
//           setProfile(null);
//         }
//         setIsLoading(false);
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   return { user, profile, isLoading };
// }



'use client';

import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function getUserProfile() {
      console.log('getUserProfile started');

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        console.log('getUser result:', user);
        console.log('getUser error:', error);

        if (error) {
          throw error;
        }

        setUser(user);

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          console.log('Profile Data:', profile);
          console.log('Profile Error:', profileError);

          if (!profileError && profile) {
            setProfile(profile as Profile);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          setUser(session.user);

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          console.log('Auth Change Profile Data:', profile);
          console.log('Auth Change Profile Error:', error);

          if (!error && profile) {
            setProfile(profile as Profile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoading,
  };
}