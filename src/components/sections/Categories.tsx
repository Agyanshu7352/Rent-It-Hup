import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { Description } from '@radix-ui/react-toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Categories = () => {
  return (
    <section id="categories" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From power tools to party supplies, find exactly what you need from trusted neighbors
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div key={category.name} variants={item}>
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 block"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    <CategoryIcon className="w-7 h-7 text-white" />
                  </div>
                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-2">{category.description}</p>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} items
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
