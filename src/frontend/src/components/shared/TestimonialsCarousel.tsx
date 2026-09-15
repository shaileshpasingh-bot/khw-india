import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useData } from "@/lib/data/store";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * TestimonialsCarousel — auto-advancing carousel of supporter testimonials
 * with manual prev/next controls and dot indicators.
 */
export function TestimonialsCarousel() {
  const { data } = useData();
  const testimonials = data.testimonials;
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-advance every 6 seconds.
  useEffect(() => {
    if (!api || testimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => window.clearInterval(timer);
  }, [api, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="md:basis-2/3 lg:basis-1/2"
            >
              <figure className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-8 shadow-card">
                <Quote className="size-8 text-accent/60" aria-hidden="true" />
                <blockquote className="flex-1 text-lg leading-relaxed text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-accent/15 text-accent">
                      {initials(testimonial.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <figcaption className="font-semibold text-foreground">
                      {testimonial.name}
                    </figcaption>
                    <p className="truncate text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                  <div
                    className="ml-auto flex gap-0.5"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star
                        // biome-ignore lint/suspicious/noArrayIndexKey: static decorative star icons
                        key={`star-${i}`}
                        className="size-4 fill-accent text-accent"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot indicators */}
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            data-ocid={`testimonial.dot.${index}`}
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={`h-2.5 rounded-full transition-all ${
              current === index
                ? "w-6 bg-accent"
                : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
