import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { ArrowLeft, Users, BookOpen, Award, Star, User, GraduationCap, Copy, Check } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [copiedField, setCopiedField] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    authLoading,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== "" &&
      signUpFormData.role !== ""
    );
  }

  const handleCopyCredentials = (email, password, role) => {
    setSignInFormData({ userEmail: email, password: password });
    setCopiedField(role);
    toast({
      title: "Credentials Copied!",
      description: `${role} credentials filled in the form.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Loading Overlay */}
      <AnimatePresence>
        {authLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600"
              />
              <motion.p
                className="text-lg font-medium text-gray-700"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {activeTab === "signin" ? "Signing you in..." : "Creating your account..."}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900">SkillSphere</span>
          </Link>
          
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Side - Marketing Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Join the Future of
                <span className="text-blue-600"> Learning</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Access world-class courses, learn from industry experts, and advance your career with SkillSphere.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">50K+ Students</h3>
                  <p className="text-gray-600 text-sm">Join our growing community</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">1000+ Courses</h3>
                  <p className="text-gray-600 text-sm">Learn anything, anywhere</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Certificates</h3>
                  <p className="text-gray-600 text-sm">Showcase your skills</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">4.9 Rating</h3>
                  <p className="text-gray-600 text-sm">Highly rated platform</p>
                </div>
              </div>
            </div>

            {/* Student Image */}
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Tabs
              value={activeTab}
              defaultValue="signin"
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Welcome back!</CardTitle>
                    <CardDescription className="text-gray-600">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommonForm
                      formControls={signInFormControls}
                      buttonText={"Sign In"}
                      formData={signInFormData}
                      setFormData={setSignInFormData}
                      isButtonDisabled={!checkIfSignInFormIsValid() || authLoading}
                      isLoading={authLoading}
                      handleSubmit={handleLoginUser}
                    />
                  </CardContent>
                </Card>

                {/* Demo Credentials Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6"
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        Demo Credentials
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Try our platform with pre-configured accounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Student Demo */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">Student Account</h4>
                              <p className="text-xs text-gray-500">Explore courses & learning</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => handleCopyCredentials("user2@email.com", "123456", "Student")}
                          >
                            {copiedField === "Student" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            {copiedField === "Student" ? "Filled!" : "Use"}
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-16">Email:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                              user2@email.com
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-16">Password:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                              123456
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Instructor Demo */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <GraduationCap className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">Instructor Account</h4>
                              <p className="text-xs text-gray-500">Create & manage courses</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => handleCopyCredentials("demoinstructor@email.com", "123456", "Instructor")}
                          >
                            {copiedField === "Instructor" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            {copiedField === "Instructor" ? "Filled!" : "Use"}
                          </Button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-16">Email:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                              demoinstructor@email.com
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs w-16">Password:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                              123456
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="signup">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Create account</CardTitle>
                    <CardDescription className="text-gray-600">
                      Join SkillSphere and start your learning journey today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommonForm
                      formControls={signUpFormControls}
                      buttonText={"Sign Up"}
                      formData={signUpFormData}
                      setFormData={setSignUpFormData}
                      isButtonDisabled={!checkIfSignUpFormIsValid() || authLoading}
                      isLoading={authLoading}
                      handleSubmit={handleRegisterUser}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">Trusted by students from</p>
              <div className="flex justify-center items-center space-x-6 opacity-60">
                <span className="text-gray-600 font-medium">Google</span>
                <span className="text-gray-600 font-medium">Microsoft</span>
                <span className="text-gray-600 font-medium">Amazon</span>
                <span className="text-gray-600 font-medium">Apple</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
