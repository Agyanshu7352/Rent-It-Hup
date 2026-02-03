import { motion } from 'framer-motion';
import { Shield, Star, Lock, Users, BadgeCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Escrow Payments',
    description: 'Your payment is held securely and only released when the item is safely returned.',
  },
  {
    icon: Star,
    title: 'AI Trust Scores',
    description: 'Our AI calculates trust scores based on return history, item condition, and reviews.',
  },
  {
    icon: BadgeCheck,
    title: 'ID Verification',
    description: 'All users are verified with Aadhaar or Student ID for a trusted community.',
  },
  {
    icon: Lock,
    title: 'Secure Transactions',
    description: 'End-to-end encryption and PCI-compliant payment processing.',
  },
  {
    icon: Users,
    title: 'Community Reviews',
    description: 'Real reviews from real neighbors help you make informed decisions.',
  },
  {
    icon: Zap,
    title: 'Instant Support',
    description: '24/7 customer support to resolve any issues quickly and fairly.',
  },
];

const TrustSection = () => {
  return (
    <section id="trust" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trust & Safety
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Safety is Our <span className="gradient-text">Priority</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built multiple layers of protection to ensure every transaction is safe and secure
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
