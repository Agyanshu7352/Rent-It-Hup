import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';


const CTA = () => {
  const navigate=useNavigate();

  const listItem=()=>{
    if(!User){
      navigate('/login');
    }
    else{
      navigate('/list-item'); 
    }
  }
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal-600 to-primary" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Start earning today
          </div>
          
          {/* Headline */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Got Items Gathering Dust?
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Turn your unused items into income. List them on Rent-It Hub and start earning from your community today.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="warm" size="xl" className="rounded-full group" onClick={listItem}>
              List Your First Item
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" className="rounded-full">
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20"
          >
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70">Active Users</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">₹2Cr+</div>
              <div className="text-white/70">Earned by Owners</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">100K+</div>
              <div className="text-white/70">Items Listed</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
