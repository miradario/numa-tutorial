import SignUp from "@/components/clerk/SignUp";

export default function SignUpScreen() {
    return (
     <SignUp signInUrl="/" scheme="numatutorial" homeUrl="(protected)"/>
    );
    }