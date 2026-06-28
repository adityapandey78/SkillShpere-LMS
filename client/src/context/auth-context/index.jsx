import PageLoader from "@/components/ui/page-loader";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { identifyUser } from "@/lib/pulsar";
import { useToast } from "@/hooks/use-toast";
import { createContext, useEffect, useState, useMemo } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();

  // Random engaging loading messages
  const loadingMessage = useMemo(() => {
    const messages = [
      " Setting up your learning space...",
      "Preparing your journey to success...",
      "Getting everything ready for you...",
      "Unlocking your potential...",
      "Creating your personalized experience...",
      "Loading your world of knowledge...",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  async function handleRegisterUser(event) {
    event.preventDefault();
    setAuthLoading(true);
    try {
      const data = await registerService(signUpFormData);
      if (data.success) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.response?.data?.message || "Network error. Please try again.",
      });
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    setAuthLoading(true);
    try {
      const data = await loginService(signInFormData);
      // console.log(data, "datadatadatadatadata");

      if (data.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.data.user.userName}!`,
        });
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        // Stitch this visitor's anonymous journey to the real user in Pulsar.
        identifyUser(data.data.user);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.message || "Invalid credentials. Please try again.",
        });
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.message || "Network error. Please try again.",
      });
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setAuthLoading(false);
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        // Re-identify returning logged-in users on refresh.
        identifyUser(data.data.user);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.log(error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    // Skip API call entirely if there's no stored token — user is definitely unauthenticated
    const token = JSON.parse(sessionStorage.getItem("accessToken") || "null");
    if (!token) {
      setLoading(false);
      return;
    }
    checkAuthUser();
  }, []);

  // console.log(auth, "gf");

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        authLoading,
        resetCredentials,
      }}
    >
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <PageLoader message={loadingMessage} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
