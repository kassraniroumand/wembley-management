import { Calendar, Users, Package, Shield } from "lucide-react"
import { MainNav } from "@/components/layout/MainNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About EventHub
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              The complete platform for managing events, resources, and bookings efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              EventHub is designed to streamline the event management process, making it easier for organizations to
              plan, schedule, and manage resources effectively. Our mission is to provide a comprehensive solution
              that eliminates the chaos of event planning and creates a seamless experience for both organizers and participants.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe that technology should simplify complex processes, not complicate them. That's why we've built
              EventHub with a focus on user experience, powerful features, and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="pb-2">
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create, schedule, and manage events with an intuitive calendar interface.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Organizer Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage teams, assign responsibilities, and coordinate across departments.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track and allocate resources effectively to avoid conflicts and maximize utilization.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure booking system with role-based permissions and advanced authentication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Team</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6">
              EventHub was created by a team of experienced developers and event management professionals who understand
              the challenges of organizing events of all sizes.
            </p>
            <p className="text-lg text-muted-foreground">
              Our diverse team brings together expertise in software development, user experience design, and event
              management to create a solution that truly addresses the needs of modern organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
