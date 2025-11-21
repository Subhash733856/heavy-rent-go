import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface Profile {
  id: string
  user_id: string
  name: string
  email?: string
  rating?: number
  total_reviews?: number
  bio?: string
  created_at: string
  updated_at: string
}

interface UserRole {
  role: 'client' | 'operator' | 'admin' | 'moderator' | 'user'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role?: 'client' | 'operator') => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  isOperator: boolean
  isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userRole, setUserRole] = useState<'client' | 'operator' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth changes FIRST (to avoid missing events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Use setTimeout to defer Supabase calls and prevent deadlock
        setTimeout(() => {
          loadProfile(session.user.id)
        }, 0)
      } else {
        setProfile(null)
        setUserRole(null)
        setLoading(false)
      }
    })

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      // @ts-ignore - Supabase types will be regenerated after migration
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (profileError) {
        console.error('Profile error:', profileError);
      }
      
      if (profileData) {
        const typedProfile: Profile = profileData as any as Profile
        setProfile(typedProfile)
      }

      // Fetch user role from user_roles table
      // @ts-ignore - Supabase types will be regenerated after migration
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (roleError) {
        console.error('Role error:', roleError);
      }
      
      if (roleData) {
        setUserRole(roleData.role as 'client' | 'operator')
      } else {
        // Fallback to user metadata if no role in user_roles table
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        const metadataRole = currentUser?.user_metadata?.role
        if (metadataRole) {
          setUserRole(metadataRole as 'client' | 'operator')
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, role: 'client' | 'operator' = 'client') => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      })
      
      if (error) throw error
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isOperator: userRole === 'operator',
    isClient: userRole === 'client'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}