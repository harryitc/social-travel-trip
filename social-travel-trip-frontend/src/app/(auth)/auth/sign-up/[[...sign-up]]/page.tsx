import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-purple-100 dark:border-purple-900",
            headerTitle: "text-purple-800 dark:text-purple-400",
            headerSubtitle: "text-gray-600 dark:text-gray-400",
            socialButtonsBlockButton: "border-purple-100 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-900/50",
            formFieldInput: "border-purple-100 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500",
            submitButton: "bg-purple-600 hover:bg-purple-700",
          },
        }}
      />
    </div>
  );
}