import { useAnalytics, useCountsAnalytics, useYearlyEventStats } from "@/hooks/useAnalytics"
import { RadialBarChart } from "@/components/ui/RadialChart"
import { EventStatsChart } from "@/components/charts/EventStatsChart"

// Define chart configurations
const categoryConfig = {
  category: {
    label: "Categories",
    color: "hsl(var(--chart-1))",
  },
}

const eventsConfig = {
  events: {
    label: "Events",
    color: "hsl(var(--chart-2))",
  },
}

const resourcesConfig = {
  resources: {
    label: "Resources",
    color: "hsl(var(--chart-3))",
  },
}

const organizersConfig = {
  organizers: {
    label: "Organizers",
    color: "hsl(var(--chart-4))",
  },
}

const eventTypesConfig = {
  eventTypes: {
    label: "Event Types",
    color: "hsl(var(--chart-5))",
  },
}

export function Home() {
  // Fetch analytics data
  const { data: analytics, isLoading } = useCountsAnalytics();
  const { data: yearlyStats, isLoading: isYearlyStatsLoading } = useYearlyEventStats(2024);
  console.log("yearlyStats", yearlyStats);
  console.log("isYearlyStatsLoading", isYearlyStatsLoading);



  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading analytics data...</div>;
  }

  if (!analytics) {
    return <div className="flex items-center justify-center h-96">No analytics data available</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Chart */}
        <RadialBarChart
          title="Categories"
          subtitle="Total Categories"
          data={{
            key: "category",
            value: analytics.categoryCount,
            fill: "hsl(var(--chart-1))",
          }}
          config={categoryConfig}
          trendValue={5.2}
          footerNote="Total number of categories in the system"
        />

        {/* Events Chart */}
        <RadialBarChart
          title="Events"
          subtitle="Total Events"
          data={{
            key: "events",
            value: analytics.eventCount,
            fill: "hsl(var(--chart-2))",
          }}
          config={eventsConfig}
          trendValue={3.1}
          footerNote="Total number of events in the system"
        />

        {/* Resources Chart */}
        <RadialBarChart
          title="Resources"
          subtitle="Total Resources"
          data={{
            key: "resources",
            value: analytics.resourceCount,
            fill: "hsl(var(--chart-3))",
          }}
          config={resourcesConfig}
          trendValue={2.8}
          footerNote="Total number of resources in the system"
        />

        {/* Resource Allocations Chart */}
        <RadialBarChart
          title="Resource Allocations"
          subtitle="Total Allocations"
          data={{
            key: "resources",
            value: analytics.resourceAllocationCount,
            fill: "hsl(var(--chart-4))",
          }}
          config={resourcesConfig}
          trendValue={1.7}
          footerNote="Total number of resource allocations"
        />

        {/* Event Configurations Chart */}
        <RadialBarChart
          title="Event Configurations"
          subtitle="Total Configurations"
          data={{
            key: "resources",
            value: analytics.eventConfigurationCount,
            fill: "hsl(var(--chart-5))",
          }}
          config={resourcesConfig}
          trendValue={-0.5}
          footerNote="Total number of event configurations"
        />

        {/* Event Types Chart */}
        <RadialBarChart
          title="Event Types"
          subtitle="Total Event Types"
          data={{
            key: "eventTypes",
            value: analytics.eventTypeCount,
            fill: "hsl(var(--chart-1))",
          }}
          config={eventTypesConfig}
          trendValue={4.2}
          footerNote="Total number of event types in the system"
        />

        {/* Organizers Chart */}
        <RadialBarChart
          title="Organizers"
          subtitle="Total Organizers"
          data={{
            key: "organizers",
            value: analytics.organizerCount,
            fill: "hsl(var(--chart-2))",
          }}
          config={organizersConfig}
          trendValue={1.5}
          footerNote="Total number of organizers in the system"
        />

        {/* Event Type Resources Chart */}
        <RadialBarChart
          title="Event Type Resources"
          subtitle="Total Event Type Resources"
          data={{
            key: "resources",
            value: analytics.eventTypeResourceCount,
            fill: "hsl(var(--chart-3))",
          }}
          config={resourcesConfig}
          trendValue={2.0}
          footerNote="Total number of event type resources"
        />
      </div>
      <EventStatsChart year={2024} />
    </div>
  )
}

export default Home;
