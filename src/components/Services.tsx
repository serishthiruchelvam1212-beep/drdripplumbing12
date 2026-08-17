import {
  AlertTriangle,
  ArrowDownUp,
  Bath,
  Building2,
  ClipboardCheck,
  Droplet,
  Flame,
  Home,
  Link2,
  LucideIcon,
  Network,
  Plug,
  Search,
  Settings,
  ShowerHead,
  UtensilsCrossed,
  Waves,
  Wrench,
} from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const SERVICES: Service[] = [
  {
    icon: AlertTriangle,
    title: 'Emergency Plumbing Assistance',
    description: 'Fast response for urgent plumbing problems that cannot wait.',
    image: 'https://images.pexels.com/photos/16509869/pexels-photo-16509869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Plumber urgently fixing pipes with tools',
  },
  {
    icon: Waves,
    title: 'Drain Cleaning',
    description: 'Clearing slow and blocked drains throughout your home or business.',
    image: 'https://images.pexels.com/photos/87299/pexels-photo-87299.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Water draining in a sink',
  },
  {
    icon: Droplet,
    title: 'Clogged Sinks & Toilets',
    description: 'Diagnosing and resolving stubborn clogs in sinks and toilets.',
    image: 'https://images.pexels.com/photos/6653889/pexels-photo-6653889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Bathroom with sink and toilet',
  },
  {
    icon: Search,
    title: 'Leak Detection & Repair',
    description: 'Locating hidden leaks and repairing them before they cause damage.',
    image: 'https://images.pexels.com/photos/18274115/pexels-photo-18274115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Leaking water pipe',
  },
  {
    icon: Wrench,
    title: 'Faucet & Fixture Repair',
    description: 'Repairing and replacing faucets and plumbing fixtures.',
    image: 'https://images.pexels.com/photos/14953886/pexels-photo-14953886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Plumbing tools and faucet on a blueprint',
  },
  {
    icon: Bath,
    title: 'Toilet Installation & Repair',
    description: 'Installing new toilets and repairing existing ones.',
    image: 'https://images.pexels.com/photos/6444240/pexels-photo-6444240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Modern bathroom with toilet and sink',
  },
  {
    icon: Link2,
    title: 'Pipe Repair & Replacement',
    description: 'Fixing damaged pipes and replacing aging plumbing lines.',
    image: 'https://images.pexels.com/photos/28169591/pexels-photo-28169591.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Copper plumbing fittings arranged in a row',
  },
  {
    icon: Flame,
    title: 'Water Heater Service',
    description: 'Service for tank and tankless water heater systems.',
    image: 'https://images.pexels.com/photos/27566315/pexels-photo-27566315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Water heater tanks installed',
  },
  {
    icon: ArrowDownUp,
    title: 'Sump Pump Service',
    description: 'Inspection, repair, and service for sump pump systems.',
    image: 'https://images.pexels.com/photos/37252656/pexels-photo-37252656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Water pump system',
  },
  {
    icon: Network,
    title: 'Sewer Line Service',
    description: 'Assessing and addressing sewer line issues.',
    image: 'https://images.pexels.com/photos/17375718/pexels-photo-17375718.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Large concrete sewer pipes',
  },
  {
    icon: UtensilsCrossed,
    title: 'Kitchen Plumbing',
    description: 'Plumbing service for kitchen sinks, lines, and connections.',
    image: 'https://images.pexels.com/photos/6253786/pexels-photo-6253786.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Modern kitchen faucet and countertop',
  },
  {
    icon: ShowerHead,
    title: 'Bathroom Plumbing',
    description: 'Plumbing service for showers, tubs, sinks, and toilets.',
    image: 'https://images.pexels.com/photos/7587289/pexels-photo-7587289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Modern bathroom with bathtub and tiles',
  },
  {
    icon: Plug,
    title: 'Appliance Plumbing Connections',
    description: 'Connections for dishwashers, washing machines, and other appliances.',
    image: 'https://images.pexels.com/photos/3829559/pexels-photo-3829559.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Dishwasher with water connections',
  },
  {
    icon: Home,
    title: 'Residential Plumbing',
    description: 'General plumbing service for homes of all sizes.',
    image: 'https://images.pexels.com/photos/30580640/pexels-photo-30580640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Modern residential homes',
  },
  {
    icon: Building2,
    title: 'Commercial Plumbing',
    description: 'Plumbing service for commercial properties and businesses.',
    image: 'https://images.pexels.com/photos/946310/pexels-photo-946310.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Commercial office building exterior',
  },
  {
    icon: ClipboardCheck,
    title: 'Plumbing Inspections',
    description: 'Assessing the condition of plumbing systems and fixtures.',
    image: 'https://images.pexels.com/photos/8293774/pexels-photo-8293774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Home inspection with checklist',
  },
  {
    icon: Settings,
    title: 'General Plumbing Maintenance',
    description: 'Routine maintenance to help keep plumbing systems running smoothly.',
    image: 'https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Plumber performing maintenance on pipes',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            From urgent repairs to routine maintenance, Freelance Plumbing handles plumbing needs for
            homes and businesses.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg ring-1 ring-white/20">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-base font-medium text-navy-600">
          Contact us for availability and an estimate.
        </p>
      </div>
    </section>
  );
}
