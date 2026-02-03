import { motion } from 'framer-motion';
import { Search, MessageCircle, CreditCard, ThumbsUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find What You Need',
    description: 'Browse items near you using our geo-spatial search. Filter by category, price, and distance.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Book',
    description: 'Chat with owners to negotiate dates and pickup details. Request to rent with one click.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay through our secure escrow system. Funds are held safely until you return the item.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: ThumbsUp,
    title: 'Enjoy & Review',
    description: 'Use the item, return it safely, and leave a review. Build your trust score for future rentals.',
    color: 'from-blue-500 to-cyan-500',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Renting from your community is simple, safe, and sustainable
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              {/* Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display font-bold text-sm text-muted-foreground border border-border">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-soft`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
