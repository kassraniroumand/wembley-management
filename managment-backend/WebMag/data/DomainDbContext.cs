using Microsoft.EntityFrameworkCore;
using WebMag.Models.domain;

namespace WebMag.data;

public class DomainDbContext : DbContext
{
    public DomainDbContext(
        DbContextOptions<DomainDbContext> dbContextOptions
    ) : base(dbContextOptions)
    {}

    public DbSet<Event> Events { get; set; }
    public DbSet<EventType> EventTypes { get; set; }
    public DbSet<Resource> Resources { get; set; }
    public DbSet<ResourceAllocation> ResourceAllocations { get; set; }
    public DbSet<Organizer> Organizers { get; set; }
    public DbSet<EventConfiguration> EventConfigurations { get; set; }
    public DbSet<EventTypeResource> EventTypeResources { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Event
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Organizer)
            .WithMany()
            .HasForeignKey(e => e.OrganizerId);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Type)
            .WithMany()
            .HasForeignKey(e => e.EventTypeId);

        // Resource Allocation
        modelBuilder.Entity<ResourceAllocation>()
            .HasOne(ra => ra.Event)
            .WithMany(e => e.ResourceAllocations)
            .HasForeignKey(ra => ra.EventId);

        modelBuilder.Entity<ResourceAllocation>()
            .HasOne(ra => ra.Resource)
            .WithMany()
            .HasForeignKey(ra => ra.ResourceId);

        // Event Configuration
        modelBuilder.Entity<EventConfiguration>()
            .HasOne(ec => ec.Event)
            .WithMany(e => e.Configurations)
            .HasForeignKey(ec => ec.EventId);

        // EventTypeResource
        modelBuilder.Entity<EventTypeResource>()
            .HasOne(etr => etr.EventType)
            .WithMany(et => et.DefaultResources)
            .HasForeignKey(etr => etr.EventTypeId);

        modelBuilder.Entity<EventTypeResource>()
            .HasOne(etr => etr.Resource)
            .WithMany()
            .HasForeignKey(etr => etr.ResourceId);

        // Booking
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Event)
            .WithMany()
            .HasForeignKey(b => b.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
