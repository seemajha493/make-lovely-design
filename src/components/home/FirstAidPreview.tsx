import { Heart, Flame, Wind, Bone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const firstAidTopics = [
  {
    icon: Heart,
    title: "CPR",
    description: "Cardiopulmonary resuscitation steps",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Flame,
    title: "Burns",
    description: "Treating minor to severe burns",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: Wind,
    title: "Choking",
    description: "Heimlich maneuver instructions",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bone,
    title: "Fractures",
    description: "Immobilizing broken bones",
    color: "bg-teal/10 text-teal",
  },
];

export function FirstAidPreview() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              First Aid Basics
            </h2>
            <p className="text-muted-foreground">
              Quick reference guides for emergency situations
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/first-aid" className="gap-2">
              View All Guides <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {firstAidTopics.map((topic) => (
            <Link
              key={topic.title}
              to="/first-aid"
              className="group p-6 rounded-2xl bg-card border border-border shadow-card card-hover text-center"
            >
              <div className={`inline-flex p-4 rounded-2xl ${topic.color} mb-4`}>
                <topic.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
