import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Seo
        title="Page not found | KHW-India"
        description="The page you're looking for could not be found."
      />
      <p className="font-display text-7xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        asChild
        className="mt-8 rounded-full"
        data-ocid="notfound.home_button"
      >
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
